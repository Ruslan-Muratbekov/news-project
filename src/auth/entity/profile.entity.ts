import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, IsString, Length} from "class-validator";

@Entity({name: 'profile'})
export class ProfileEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({nullable: true, unique: true, default: null})
	@IsEmail()
	email: string

	@Column({nullable: false, unique: true})
	@IsString()
	@Length(1, 50)
	username: string

	@Column({nullable: true, default: null})
	@IsString()
	@Length(1, 40)
	last_name: string

	@Column({nullable: true, default: null})
	@IsString()
	@Length(1, 40)
	first_name: string
}