import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy, 'jwt_password') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwt_password'),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET_PASSWORD_KEY
		});
	}

	validate(payload) {
		return payload
	}

}