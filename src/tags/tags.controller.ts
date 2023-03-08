import {Controller, Delete, Get, Patch, Post, Put} from '@nestjs/common';
import {TagsService} from "./tags.service";

@Controller('tags')
export class TagsController {
	constructor(
		private readonly tagsService: TagsService
	) {
	}

	@Get()
	tagsGetAll(){

	}

	@Post()
	tagsPost(){

	}

	@Get()
	tagsGet(){

	}

	@Put()
	tagsPut(){

	}

	@Patch()
	tagsPatch(){

	}

	@Delete()
	tagsDelete(){

	}
}
