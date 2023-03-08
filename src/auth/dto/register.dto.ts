import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
	@ApiProperty()
	username: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	password_confirm: string;

	@ApiProperty()
	email?: string;

	@ApiProperty()
	last_name?: string;

	@ApiProperty()
	first_name?: string;
}