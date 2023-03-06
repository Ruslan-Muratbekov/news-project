import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {AuthEntity} from "./entity/auth.entity";
import {TokenEntity} from "./entity/token.entity";

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		TypeOrmModule.forFeature([AuthEntity, TokenEntity]),
		JwtModule.register({})
	]
})
export class AuthModule {
}
