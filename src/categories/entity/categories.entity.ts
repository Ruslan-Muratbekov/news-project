import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CategoriesEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@Column()
	description: string

	@Column()
	content: string

	@Column()
	views: string

	@Column()
	is_published: string

	@Column()
	category: string

	@Column()
	author: string

	@Column()
	tags: string
}