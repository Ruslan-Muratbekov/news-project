import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthEntity} from "./entity/auth.entity";
import {Repository} from "typeorm";

import * as bcrypt from 'bcrypt'
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
import {VerifyEmailEntity} from "./entity/verifyEmail.entity";
import {VerifyEmailDto} from "./dto/verifyEmail.dto";
import {VerifyPasswordEntity} from "./entity/verifyPassword.entity";
import {ProfileEntity} from "./entity/profile.entity";
import {ProfileGetDto} from "./dto/profileGet.dto";
import {ProfilePostDto} from "./dto/profilePost.dto";
import {ProfilePutDto} from "./dto/profilePut.dto";
import {ProfilePatchDto} from "./dto/profilePatch.dto";

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
		@InjectRepository(VerifyEmailEntity) private readonly verifyRepository: Repository<VerifyEmailEntity>,
		@InjectRepository(VerifyPasswordEntity) private readonly verifyPasswordRepository: Repository<VerifyPasswordEntity>,
		@InjectRepository(ProfileEntity) private readonly profileRepository: Repository<ProfileEntity>,
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

	async profileGet(user: ProfileGetDto) {
		const profile = await this.profileRepository.findOne({where: {username: user.username}})
		if (profile) {
			return profile
		}
		throw new HttpException('Такого профиля нету!', HttpStatus.BAD_REQUEST)
	}

	async profilePost({username, first_name, last_name}: ProfilePostDto) {
		const candidate = await this.profileRepository.findOne({where: {username}})
		if(candidate){
			throw new BadRequestException('Э такой пользователь уже есть базар фильтруй')
		}
		const newProfile = await this.profileRepository.create({
			username,
			last_name,
			first_name
		});
		return this.profileRepository.manager.save(newProfile)
	}

	async profilePut(user: ProfilePutDto, data: ProfilePutDto) {
		const candidate = await this.profileRepository.findOne({where: {username: user.username}})
		const authEntity = await this.authRepository.findOne({where: {username: user.username}})
		if(!candidate){
			throw new BadRequestException('Э такого пользователь нету базар фильтруй')
		}
		authEntity.username = data?.username
		authEntity.first_name = data?.first_name
		authEntity.last_name = data?.last_name

		candidate.username = data?.username
		candidate.first_name = data?.first_name
		candidate.last_name = data?.last_name
		await this.profileRepository.manager.save(authEntity)
		return this.profileRepository.manager.save(candidate)
	}

	async profilePatch(user: ProfilePatchDto, data: ProfilePatchDto) {
		return await this.profilePut(user, data)
	}

	async registerEmail(email, user: ReqUserDto): Promise<void> {
		const verify = await this.verifyRepository.findOne({where: {authId: user.id}})
		const emailToken = await this.generateEmailToken({email, id: user.id})
		if (verify) {
			verify.email = email;
			verify.tokens = emailToken;
			await this.verifyRepository.manager.save(verify)
			await this.sendActivationMail(email, `${process.env.API_URL}/api/auth/verify-email/?jwt_link=${emailToken}`)
			return;
		}

		const data = await this.verifyRepository.create({email, tokens: emailToken, authId: user.id})
		await this.verifyRepository.manager.save(data)
		await this.sendActivationMail(email, `${process.env.API_URL}/api/auth/verify-email/?jwt_link=${emailToken}`)
		return;
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

	async resetPassword(jwt_password: string, {password, password_confirm}: ResetPasswordDto, {authId}): Promise<void> {
		if (password !== password_confirm || !password || !password_confirm) {
			throw new HttpException('Пароли не совпадает', HttpStatus.BAD_REQUEST)
		}
		const passwordModel = await this.verifyPasswordRepository.findOne({where: {authId}})
		const userModel = await this.authRepository.findOne({where: {id: authId}})
		if (!userModel) {
			throw new HttpException('Ошибка! аккаунт не существует', HttpStatus.BAD_REQUEST)
		}
		userModel.password = await bcrypt.hash(password, 8)
		await this.authRepository.manager.save(userModel)
		await this.verifyPasswordRepository.manager.remove(passwordModel)
		return;
	}

	async sendResetPassword(login: string) {
		const user = await this.authRepository.findOne({where: {username: login}})
		if (!user) throw new HttpException('Такого пользователя нету!', HttpStatus.BAD_REQUEST)
		if (!user.email) throw new HttpException('Почта еще не зарегана', HttpStatus.BAD_REQUEST)

		const tokens = await this.generatePasswordToken({authId: user.id})
		const passwordModel = await this.verifyPasswordRepository.findOne({where: {authId: user.id}})

		if (passwordModel) {
			passwordModel.tokens = tokens
			await this.verifyPasswordRepository.manager.save(passwordModel)
			await this.sendResetPasswordLink(
				user.email,
				`${process.env.API_URL}/api/auth/reset-password/?jwt_password=${tokens}`
			)
			return;
		}

		const verifyPasswordModel = await this.verifyPasswordRepository.create({tokens, authId: user.id})
		await this.verifyPasswordRepository.manager.save(verifyPasswordModel)
		await this.sendResetPasswordLink(
			user.email,
			`${process.env.API_URL}/api/auth/reset-password/?jwt_password=${tokens}`
		)
		return;
	}

	async verifyEmail(link: string, user: VerifyEmailDto) {
		const candidate = await this.authRepository.findOne({where: {id: user.id}})
		if (!candidate) throw new HttpException('Ошибка в ссылке!', HttpStatus.BAD_REQUEST)
		candidate.email = user.email
		await this.authRepository.manager.save(candidate)
		const verifyModel = await this.verifyRepository.findOne({where: {authId: user.authId}})
		await this.verifyRepository.manager.remove(verifyModel)
	}

	private async generateEmailToken(payload) {
		return this.jwtService.sign(payload, {expiresIn: '30m', secret: process.env.SECRET_MAIL_KEY})
	}

	private async generatePasswordToken(payload) {
		return this.jwtService.sign(payload, {expiresIn: '30m', secret: process.env.SECRET_PASSWORD_KEY})
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
					<p>Ссылка будет работать в течении 30 минут после она будет не рабочии</p>
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
