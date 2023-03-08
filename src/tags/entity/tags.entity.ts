import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class TagsEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({nullable: true})
	count: number

	@Column()
	title: string

	@UpdateDateColumn()
	updatedDate: Date

	@CreateDateColumn()
	createdDate: Date
}