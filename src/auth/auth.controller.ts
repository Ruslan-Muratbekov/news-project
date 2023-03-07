import {Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ApiExcludeEndpoint, ApiTags} from "@nestjs/swagger";
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

	@Get('profile')
	async profileGet() {

	}

	@Post('profile')
	async profilePost() {

	}

	@Put('profile')
	async profilePut() {

	}

	@Patch('profile')
	async profilePatch() {

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

	@Post('reset-password/:link')
	async resetPassword(
		@Param('link') link: string,
		@Body() data: ResetPasswordDto
	): Promise<void> {
		await this.authService.resetPassword(link, data)
	}

	@Post('send-reset-password-link')
	async sendResetPassword(@Body() data: SendResetPasswordDto) {
		await this.authService.sendResetPassword(data.login)
	}

	@UseGuards(AccessGuard)
	@Get('verify-email/:link')
	async verifyEmail(@Param('link') link: string) {
		// @ts-ignore
		await this.authService.verifyEmail(link)
	}

	@Post('verify-registration')
	async verifyRegistration() {

	}
}
