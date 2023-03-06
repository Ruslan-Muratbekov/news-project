export interface IRegister {
	accessToken: string,
	refreshToken: string,
	user: {
		id: string
		email?: string,
		username: string,
		last_name?: string,
		first_name?: string,
	}
}