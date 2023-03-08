import {ApiProperty} from "@nestjs/swagger";

export class SendResetPasswordDto {
	@ApiProperty()
	login: string
}