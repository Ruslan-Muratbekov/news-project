import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {CategoriesService} from "./categories.service";

@Controller('categories')
export class CategoriesController {
	constructor(
		private readonly categoriesService: CategoriesService
	) {
	}

	@Get()
	async categoriesGetAll(){
		return this.categoriesService.categoriesGetAll()
	}

	@Post()
	async categoriesPost(
		@Body() title: string
	){
		return this.categoriesService.categoriesPost(title)
	}

	@Get(':id')
	async categoriesGet(
		@Param('id') id: number
	){
		return this.categoriesService.categoriesGet(id)
	}

	@Put(':id')
	async categoriesPut(
		@Param('id') id: number,
		@Body('title') title: string
	){
		return this.categoriesService.categoriesPut(id, title)
	}

	@Patch(':id')
	async categoriesPatch(
		@Param('id') id: number,
		@Body('title') title: string
	){
		return this.categoriesService.categoriesPatch(id, title)
	}

	@Delete(':id')
	async categoriesDelete(
		@Param('id') id: number
	){
		return this.categoriesService.categoriesDelete(id)
	}
}
