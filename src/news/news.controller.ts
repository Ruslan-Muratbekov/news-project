import {Controller, Delete, Get, Patch, Post, Put} from '@nestjs/common';
import {NewsService} from "./news.service";

@Controller('news')
export class NewsController {
	constructor(
		private readonly newsService: NewsService
	) {
	}

	@Get()
	newsGetAll(){

	}

	@Post()
	newsPost(){

	}

	@Get()
	newsGet(){

	}

	@Put()
	newsPut(){

	}

	@Patch()
	newsPatch(){

	}

	@Delete()
	newsDelete(){

	}
}
