import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class NewsEntity {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column()
	description: string

	@Column()
	content: string

	@Column()
	category: string

	@Column()
	author: string

	@Column()
	tags: string
}