import {Body, Controller, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ApiExcludeEndpoint, ApiTags} from "@nestjs/swagger";
import {RegisterDto} from "./dto/register.dto";
import {IRegister} from "./interface/register.interface";
import {ResetPasswordDto} from "./dto/resetPassword.dto";
import {SendResetPasswordDto} from "./dto/sendResetPassword.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {
	}

	@Post('change-password')
	async changePassword() {

	}

	@Post('login')
	async login() {

	}

	@Post('logout')
	async logout() {

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

	@Post('register-email')
	async registerEmail() {

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

	@Post('verify-email')
	async verifyEmail() {

	}

	@Post('verify-registration')
	async verifyRegistration() {

	}
}
