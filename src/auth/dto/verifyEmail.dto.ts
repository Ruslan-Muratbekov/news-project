import {ApiProperty} from "@nestjs/swagger";

export class VerifyEmailDto {
	@ApiProperty()
	email: string

	@ApiProperty()
	tokens: string

	@ApiProperty()
	authId: number

	@ApiProperty()
	id: number
}