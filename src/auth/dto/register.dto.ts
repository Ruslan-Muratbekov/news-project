export class RegisterDto {
	username: string;
	password: string;
	password_confirm: string;
	email?: string;
	last_name?: string;
	first_name?: string;
}