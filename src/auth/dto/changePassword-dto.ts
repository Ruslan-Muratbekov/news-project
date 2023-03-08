import {ResetPasswordDto} from "./resetPassword.dto";
import {ApiProperty} from "@nestjs/swagger";

export class ChangePasswordDto extends ResetPasswordDto {
	@ApiProperty()
	old_password: string
}