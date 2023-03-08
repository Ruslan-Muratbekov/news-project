import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {NewsEntity} from "./entity/news.entity";
import {Repository} from "typeorm";
import {NewPostDto} from "./dto/newPost.dto";

@Injectable()
export class NewsService {
	constructor(
		@InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>
	) {
	}

	async newsGetAll() {
		return this.newsRepository.find()
	}

	async newsPost({tags, content, description, category, title, author}: NewPostDto) {
		const newPost =  this.newsRepository.create({tags, content, description, category, title, author})
		return this.newsRepository.manager.save(newPost)
	}

	async newsGet(id) {
		return this.newsRepository.findOne({where: {id}})
	}

	async newsPut(id, {title, author, category, content, description, tags}: NewPostDto) {
		const post = await this.newsRepository.findOne({where: {id}})
		if(!post){
			throw new BadRequestException('Такого поста нету')
		}
		post.title = title
		post.author = author
		post.category = category
		post.content = content
		post.description = description
		post.tags = tags

		return this.newsRepository.manager.save(post)
	}

	async newsPatch(id, data: NewPostDto) {
		return this.newsPut(id, data)
	}

	async newsDelete(id) {
		const removePost = await this.newsRepository.findOne({where: {id}})
		return this.newsRepository.manager.remove(removePost)
	}
}
