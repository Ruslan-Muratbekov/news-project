import {Controller, Delete, Get, Patch, Post, Put} from '@nestjs/common';
import {CategoriesService} from "./categories.service";

@Controller('categories')
export class CategoriesController {
	constructor(
		private readonly categoriesService: CategoriesService
	) {
	}

	@Get()
	categoriesGetAll(){

	}

	@Post()
	categoriesPost(){

	}

	@Get()
	categoriesGet(){

	}

	@Put()
	categoriesPut(){

	}

	@Patch()
	categoriesPatch(){

	}

	@Delete()
	categoriesDelete(){

	}
}
