import {ResetPasswordDto} from "./resetPassword.dto";

export class ChangePasswordDto extends ResetPasswordDto {
	old_password: string
}