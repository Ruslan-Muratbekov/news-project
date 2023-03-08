import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriesEntity} from "./entity/categories.entity";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([CategoriesEntity])
  ]
})
export class CategoriesModule {}
