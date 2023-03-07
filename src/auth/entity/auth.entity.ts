import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsEmail, IsString, isUUID, Length} from "class-validator";
import {TokenEntity} from "./token.entity";

@Entity({name: 'auth'})
export class AuthEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({nullable: true, unique: true, default: null})
	@IsEmail()
	email: string

	@Column({nullable: false, unique: true})
	@IsString()
	@Length(1, 50)
	username: string

	@Column({nullable: false})
	@IsString()
	@Length(8, 150)
	password: string

	@Column({nullable: true, default: null})
	@IsString()
	@Length(1, 40)
	last_name: string

	@Column({nullable: true, default: null})
	@IsString()
	@Length(1, 40)
	first_name: string

	@OneToOne(() => TokenEntity, (token) => token.authEntity)
	TokenEntity: TokenEntity
}