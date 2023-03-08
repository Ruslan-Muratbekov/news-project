import {InjectRepository} from "@nestjs/typeorm";
import {TagsEntity} from "./entity/tags.entity";
import {Repository} from "typeorm";
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class TagsService {
	constructor(
		@InjectRepository(TagsEntity) private readonly tagsRepository: Repository<TagsEntity>
	) {
	}

	async tagsGetAll(){
		return this.tagsRepository.find()
	}

	async tagsPost(title){
		const tags = await this.tagsRepository.create({title})
		return this.tagsRepository.manager.save(tags)
	}

	async tagsGet(id){
		return this.tagsRepository.findOne({where: {id}})
	}

	async tagsPut(id, title){
		const tags = await this.tagsRepository.findOne({where: {id}})
		if(!tags){
			throw new BadRequestException('такого поста нету')
		}
		tags.title = title
		return this.tagsRepository.manager.save(tags)
	}

	async tagsPatch(id, title){
		return this.tagsPut(id, title)
	}

	async tagsDelete(id){
		const tags = await this.tagsRepository.findOne({where: {id}})
		return this.tagsRepository.manager.remove(tags)
	}
}
