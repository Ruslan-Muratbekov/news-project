import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {TagsModule} from './tags/tags.module';
import {NewsModule} from './news/news.module';
import {CategoriesModule} from './categories/categories.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
	imports: [
		ConfigModule.forRoot({isGlobal: true}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [],
			synchronize: true,
		}),
		AuthModule,
		TagsModule,
		NewsModule,
		CategoriesModule,
	],
})
export class AppModule {
}
