import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {TagsService} from "./tags.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("tags")
@Controller('tags')
export class TagsController {
	constructor(
		private readonly tagsService: TagsService
	) {
	}

	@Get()
	async tagsGetAll() {
		return this.tagsService.tagsGetAll()
	}

	@Post()
	async tagsPost(
		@Body() title: string
	) {
		return this.tagsService.tagsPost(title)
	}

	@Get(':id')
	async tagsGet(
		@Param('id') id: number
	) {
		return this.tagsService.tagsGet(id)
	}

	@Put(':id')
	async tagsPut(
		@Body() title: string,
		@Param('id') id: number
	) {
		return this.tagsService.tagsPut(id, title)
	}

	@Patch(':id')
	async tagsPatch(
		@Body() title: string,
		@Param('id') id: number
	) {
		return this.tagsService.tagsPatch(id, title)
	}

	@Delete(':id')
	async tagsDelete(
		@Param('id') id: number
	) {
		return this.tagsService.tagsDelete(id)
	}
}
