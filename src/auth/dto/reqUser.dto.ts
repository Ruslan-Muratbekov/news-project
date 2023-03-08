import {ApiProperty} from "@nestjs/swagger";

export class ReqUserDto {
	id: number;

	email: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	last_name: string;

	@ApiProperty()
	first_name: string;

	iat: number;

	exp: number
}