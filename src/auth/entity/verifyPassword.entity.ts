import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class VerifyPasswordEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	tokens: string

	@Column()
	authId: number
}