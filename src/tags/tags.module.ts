import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TagsEntity} from "./entity/tags.entity";

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    TypeOrmModule.forFeature([TagsEntity])
  ]
})
export class TagsModule {}
