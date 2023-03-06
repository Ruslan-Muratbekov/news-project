export class UserDto {
	email: string;
	username: string;
	last_name: string;
	first_name: string;
	id: string

	constructor(model) {
		this.id = model.id
		this.email = model.email
		this.username = model.username
		this.last_name = model.last_name
		this.first_name = model.first_name
	}
}