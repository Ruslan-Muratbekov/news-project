import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class CategoriesEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@UpdateDateColumn()
	updatedDate: Date

	@CreateDateColumn()
	createdDate: Date
}