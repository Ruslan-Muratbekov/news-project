import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {AuthEntity} from "./entity/auth.entity";
import {TokenEntity} from "./entity/token.entity";
import {AccessStrategy} from "./strategys/access.strategy";
import {RefreshStrategy} from "./strategys/refresh.strategy";
import {EmailStrategy} from "./strategys/email.strategy";
import {VerifyEmailEntity} from "./entity/verifyEmail.entity";
import {VerifyPasswordEntity} from "./entity/verifyPassword.entity";
import {PasswordStrategy} from "./strategys/password.strategy";

@Module({
	controllers: [AuthController],
	providers: [AuthService, AccessStrategy, RefreshStrategy, EmailStrategy, PasswordStrategy],
	imports: [
		TypeOrmModule.forFeature([AuthEntity, TokenEntity, VerifyEmailEntity, VerifyPasswordEntity]),
		JwtModule.register({})
	]
})
export class AuthModule {
}
