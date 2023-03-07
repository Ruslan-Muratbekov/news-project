import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthEntity} from "./entity/auth.entity";
import {Repository} from "typeorm";

import * as bcrypt from 'bcrypt'
import * as uuid from 'uuid'
import * as process from "process";
import * as nodemailer from 'nodemailer'
import {UserDto} from "./dto/user.dto";
import {JwtService} from "@nestjs/jwt";
import {TokenEntity} from "./entity/token.entity";
import {validate} from "class-validator";
import {IRegister} from "./interface/register.interface";
import {ResetPasswordDto} from "./dto/resetPassword.dto";
import {LoginDto} from "./dto/login.dto";
import {TLogin} from "./interface/login.interface";
import {ReqUserDto} from "./dto/reqUser.dto";
import {LogoutDto} from "./dto/logout.dto";
import {ChangePasswordDto} from "./dto/changePassword-dto";

@Injectable()
export class AuthService {
	transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.SMTP_USERS}`,
			pass: `${process.env.SMTP_PASSWORD}`
		}
	})

	constructor(
		@InjectRepository(AuthEntity) private readonly authRepository: Repository<AuthEntity>,
		@InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
		private readonly jwtService: JwtService
	) {
	}

	async changePassword(data: ChangePasswordDto, user: ReqUserDto): Promise<void> {
		const candidate = await this.authRepository.findOne({where: {username: user.username}})
		if (!candidate) throw new HttpException('Ошибка!', HttpStatus.BAD_REQUEST)

		const verifyPassword = await bcrypt.compare(data.old_password, candidate.password)
		if (!verifyPassword) throw new HttpException('Не правильный пароль', HttpStatus.BAD_REQUEST)

		if (data.password !== data.password_confirm) throw new HttpException('Ошибка в валидации', HttpStatus.BAD_REQUEST)

		candidate.password = await bcrypt.hash(data.password, 8)
		await this.authRepository.manager.save(candidate)
		return;
	}

	async login({username, password}: LoginDto): Promise<TLogin> {
		const user = await this.authRepository.findOne({where: {username}})
		if (!user) throw new HttpException('Ошибка! такого user нету', HttpStatus.BAD_REQUEST)
		const verifyPassword = await bcrypt.compare(password, user.password)
		if (!verifyPassword) throw new HttpException('Ошибка! логин или пароль не правильный', HttpStatus.BAD_REQUEST)
		const userDto = new UserDto(user)
		const tokens = await this.generateTokens({...userDto})
		const userTokenModel = await this.tokenRepository.findOne({where: {authId: Number(userDto.id)}})
		userTokenModel.refreshToken = tokens.refreshToken
		await this.tokenRepository.manager.save(userTokenModel)

		return {...tokens, user: userDto}
	}

	async logout(user: LogoutDto): Promise<void> {
		const tokens = await this.tokenRepository.findOne({where: {authId: user.id}})
		if (!tokens) throw new HttpException('Ошибка! такого token нету', HttpStatus.BAD_REQUEST)
		tokens.refreshToken = null
		await this.tokenRepository.manager.save(tokens)
		return;
	}

	async profileGet() {

	}

	async profilePost() {

	}

	async profilePut() {

	}

	async profilePatch() {

	}

	async registerEmail(email, user: ReqUserDto): Promise<void> {
		const candidate = await this.authRepository.findOne({where: {username: user.username}})
		if (!candidate) throw new HttpException('Ошибка! такого user нету', HttpStatus.BAD_REQUEST)
		const resetEmailLink = uuid.v4()
		candidate.resetEmailLink = resetEmailLink
		candidate.email = email
		await this.authRepository.manager.save(candidate)
		await this.sendActivationMail(email, `${process.env.API_URL}/api/auth/verify-email/${resetEmailLink}`)
	}

	async register({
									 email,
									 username,
									 password,
									 password_confirm,
									 last_name,
									 first_name
								 }: RegisterDto): Promise<IRegister> {
		const candidate = await this.authRepository.findOne({
			where: [
				{username}, {email}
			]
		})

		if (candidate) throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
		if (password !== password_confirm) throw new HttpException('Пароль не совпадает', HttpStatus.BAD_REQUEST)

		const hashPassword = await bcrypt.hash(password, 8)
		const authEntity = new AuthEntity()
		authEntity.email = email
		authEntity.password = hashPassword
		authEntity.username = username
		authEntity.last_name = last_name
		authEntity.first_name = first_name
		const errors = await validate(authEntity, {skipMissingProperties: true})
		if (errors.length > 0) throw new HttpException(`Validation failed!`, HttpStatus.BAD_REQUEST)
		const user = await this.authRepository.manager.save(authEntity)

		const userDto = new UserDto(user)
		const tokens = await this.generateTokens({...userDto})

		const tokenEntity = new TokenEntity()
		tokenEntity.refreshToken = tokens.refreshToken
		tokenEntity.authId = user.id
		await this.tokenRepository.manager.save(tokenEntity)

		return {...tokens, user: userDto}
	}

	async resetPassword(link: string, data: ResetPasswordDto): Promise<void> {
		const user = await this.authRepository.findOne({where: {resetPasswordLink: link}})
		if (!user) throw new HttpException('Ошибка! Не правильная ссылка или ссылка устарела!', HttpStatus.BAD_REQUEST)
		if (data.password !== data.password_confirm) throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST)
		user.password = await bcrypt.hash(data.password, 8)
		user.resetPasswordLink = ''
		await this.authRepository.manager.save(user)
		return;
	}

	async sendResetPassword(login: string) {
		const user = await this.authRepository.findOne({where: {username: login}})
		if (!user) throw new HttpException('Такого пользователя нету!', HttpStatus.BAD_REQUEST)
		if (!user.email) throw new HttpException('Почта еще не зарегана', HttpStatus.BAD_REQUEST)
		const resetPasswordLink = uuid.v4()
		user.resetPasswordLink = resetPasswordLink
		await this.authRepository.manager.save(user)
		await this.sendResetPasswordLink(
			user.email,
			`${process.env.API_URL}/api/auth/reset-password/${resetPasswordLink}`
		)
		return;
	}

	async verifyEmail(link: string) {
		const candidate = await this.authRepository.findOne({where: {resetEmailLink: link}})
		if (!candidate) throw new HttpException('Такого пользователя нету!', HttpStatus.BAD_REQUEST)
		candidate.resetEmailLink = null
		candidate.isActivated = true
		await this.authRepository.manager.save(candidate)
	}

	async verifyRegistration() {

	}

	private async generateTokens(payload) {
		const accessToken = this.jwtService.sign(payload, {expiresIn: '30m', secret: process.env.SECRET_ACCESS_KEY})
		const refreshToken = this.jwtService.sign(payload, {expiresIn: '7d', secret: process.env.SECRET_REFRESH_KEY})
		return {
			accessToken,
			refreshToken
		}
	}

	private async sendActivationMail(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USERS,
			to,
			subject: `Активация аккаунта на ${process.env.API_URL}`,
			text: '',
			html: `
			<div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${link}">${link}</a>	
			</div>`
		})
	}

	private async sendResetPasswordLink(to, link) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USERS,
			to,
			subject: `Перейдите по ссылке что мы поменять пароль ${process.env.API_URL}`,
			text: '',
			html: `
			<div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${link}">${link}</a>	
			</div>`
		})
	}
}
