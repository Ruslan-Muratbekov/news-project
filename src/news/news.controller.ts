import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {NewsService} from "./news.service";
import {NewPostDto} from "./dto/newPost.dto";

@Controller('news')
export class NewsController {
	constructor(
		private readonly newsService: NewsService
	) {
	}

	@Get()
	async newsGetAll(){
		return this.newsService.newsGetAll()
	}

	@Post()
	async newsPost(
		@Body() data: NewPostDto
	){
		return this.newsService.newsPost(data)
	}

	@Get('id')
	async newsGet(
		@Param('id') id: number
	){
		return this.newsService.newsGet(id)
	}

	@Put('id')
	async newsPut(
		@Body() data: NewPostDto,
		@Param('id') id: number
	){
		return this.newsService.newsPut(id, data)
	}

	@Patch('id')
	async newsPatch(
		@Body() data: NewPostDto,
		@Param('id') id: number
	){
		return this.newsService.newsPatch(id, data)
	}

	@Delete('id')
	async newsDelete(
		@Param('id') id: number
	){
		return this.newsService.newsDelete(id)
	}
}
