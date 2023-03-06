import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {AuthEntity} from "./auth.entity";

@Entity()
export class TokenEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	refreshToken: string

	@Column()
	authId: number

	@OneToOne(() => AuthEntity, (auth) => auth.TokenEntity, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	authEntity: AuthEntity
}