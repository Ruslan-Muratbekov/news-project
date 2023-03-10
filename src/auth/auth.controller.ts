import {Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ApiCreatedResponse, ApiExcludeEndpoint, ApiForbiddenResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {RegisterDto} from "./dto/register.dto";
import {IRegister} from "./interface/register.interface";
import {ResetPasswordDto} from "./dto/resetPassword.dto";
import {SendResetPasswordDto} from "./dto/sendResetPassword.dto";
import {LoginDto} from "./dto/login.dto";
import {TLogin} from "./interface/login.interface";
import {AccessGuard} from "../common/guards/access.guard";
import {Request} from "express";
import {RefreshGuard} from "../common/guards/refresh.guard";
import {ChangePasswordDto} from "./dto/changePassword-dto";
import {EmailGuard} from "../common/guards/email.guard";
import {PasswordGuard} from "../common/guards/password.guard";
import {ProfilePutDto} from "./dto/profilePut.dto";
import {ProfilePatchDto} from "./dto/profilePatch.dto";
import {ProfileGetDto} from "./dto/profileGet.dto";
import {ProfilePostDto} from "./dto/profilePost.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {
	}

	@UseGuards(AccessGuard)
	@Post('change-password')
	async changePassword(
		@Body() data: ChangePasswordDto,
		@Req() req: Request
	): Promise<void> {
		// @ts-ignore
		await this.authService.changePassword(data, req.user)
	}

	@Post('login')
	async login(@Body() data: LoginDto): Promise<TLogin> {
		return this.authService.login(data)
	}

	@UseGuards(RefreshGuard)
	@Get('logout')
	async logout(
		@Req() req: Request
	): Promise<void> {
		await this.authService.logout(req.user)
	}

	@UseGuards(AccessGuard)
	@Get('profile')
	@ApiCreatedResponse({type: ProfileGetDto})
	async profileGet(
		@Req() req: Request
	) {
		// @ts-ignore
		return this.authService.profileGet(req.user)
	}

	@UseGuards(AccessGuard)
	@Post('profile')
	@ApiCreatedResponse({type: ProfilePostDto})
	async profilePost(
		@Req() req: Request
	) {
		// @ts-ignore
		return this.authService.profilePost(req.user)
	}

	@UseGuards(AccessGuard)
	@Put('profile')
	@ApiCreatedResponse({type: ProfilePutDto})
	async profilePut(
		@Req() req: Request,
		@Body() data: ProfilePutDto
	) {
		// @ts-ignore
		return this.authService.profilePut(req.user, data)
	}

	@UseGuards(AccessGuard)
	@Patch('profile')
	@ApiCreatedResponse({type: ProfilePatchDto})
	async profilePatch(
		@Req() req: Request,
		@Body() data: ProfilePatchDto
	) {
		// @ts-ignore
		return this.authService.profilePatch(req.user, data)
	}

	@UseGuards(AccessGuard)
	@Post('register-email')
	async registerEmail(
		@Body("email") email: string,
		@Req() req: Request
	): Promise<void> {
		// @ts-ignore
		await this.authService.registerEmail(email, req.user)
	}

	@Post('register')
	async register(@Body() data: RegisterDto): Promise<IRegister> {
		return this.authService.register(data)
	}

	@UseGuards(PasswordGuard)
	@Post('reset-password/')
	async resetPassword(
		@Query('jwt_password') jwt_password: string,
		@Body() data: ResetPasswordDto,
		@Req() req: Request
	): Promise<void> {
		// @ts-ignore
		await this.authService.resetPassword(jwt_password, data, req.user)
	}

	@Post('send-reset-password-link')
	async sendResetPassword(@Body() data: SendResetPasswordDto) {
		await this.authService.sendResetPassword(data.login)
	}

	@UseGuards(EmailGuard)
	@Get('verify-email/')
	async verifyEmail(
		@Query('jwt_link') jwt_link: string,
		@Req() req: Request
	) {
		// @ts-ignore
		await this.authService.verifyEmail(jwt_link, req.user)
	}
}
