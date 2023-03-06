import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		TypeOrmModule.forFeature([]),
		JwtModule.register({})
	]
})
export class AuthModule {
}
