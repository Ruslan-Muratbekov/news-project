import {Controller, Get, Patch, Post, Put} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {
	}

	@Post('change-password')
	changePassword(){

	}

	@Post('login')
	login(){

	}

	@Post('logout')
	logout(){

	}

	@Get('profile')
	profileGet(){

	}

	@Post('profile')
	profilePost(){

	}

	@Put('profile')
	profilePut(){

	}

	@Patch('profile')
	profilePatch(){

	}

	@Post('register-email')
	registerEmail(){

	}

	@Post('register')
	register(){

	}

	@Post('reset-password')
	resetPassword(){

	}

	@Post('send-reset-password-link')
	sendResetPasswordLink(){

	}

	@Post('verify-email')
	verifyEmail(){

	}

	@Post('verify-registration')
	verifyRegistration(){

	}
}
