import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail} from "class-validator";

@Entity()
export class VerifyEmailEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@IsEmail()
	email: string

	@Column()
	tokens: string

	@Column()
	authId: number
}