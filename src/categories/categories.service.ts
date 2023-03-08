import {BadRequestException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CategoriesEntity} from "./entity/categories.entity";

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(CategoriesEntity) private readonly categoriesRepository: Repository<CategoriesEntity>,
	) {
	}

	async categoriesGetAll(){
		return this.categoriesRepository.find()
	}

	async categoriesPost(title){
		const check = await this.categoriesRepository.findOne({where: {title}})
		if(check) throw new BadRequestException("Такой tag уже существует")
		const createTitle = await this.categoriesRepository.create({title})
		return this.categoriesRepository.manager.save(createTitle)
	}

	async categoriesGet(id){
		return this.categoriesRepository.findOne({where: {id}})
	}

	async categoriesPut(id, title){
		const changeTitle = await this.categoriesRepository.findOne({where: {id}})
		changeTitle.title = title
		return this.categoriesRepository.manager.save(changeTitle)
	}

	async categoriesPatch(id, title){
		return this.categoriesPut(id, title)
	}

	async categoriesDelete(id){
		const deleteTitle = await this.categoriesRepository.findOne({where: {id}})
		return this.categoriesRepository.manager.remove(deleteTitle)
	}
}
