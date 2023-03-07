import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";

@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy, 'jwt_email') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromUrlQueryParameter('jwt_link'),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET_MAIL_KEY,
		});
	}

	validate(payload) {
		return payload
	}

}