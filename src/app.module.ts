import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {TagsModule} from './tags/tags.module';
import {NewsModule} from './news/news.module';
import {CategoriesModule} from './categories/categories.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthEntity} from "./auth/entity/auth.entity";
import {TokenEntity} from "./auth/entity/token.entity";
import {VerifyEmailEntity} from "./auth/entity/verifyEmail.entity";
import {VerifyPasswordEntity} from "./auth/entity/verifyPassword.entity";

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
			entities: [AuthEntity, TokenEntity, VerifyEmailEntity, VerifyPasswordEntity],
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
