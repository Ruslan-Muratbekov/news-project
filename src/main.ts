import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
	const PORT = process.env.PORT || 5000

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api')

	const config = new DocumentBuilder()
		.setTitle('News API')
		.setDescription('Новостной портал')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/swagger', app, document);

	await app.listen(PORT, () => console.log(`Server started on URL http://localhost:${PORT}`));
}

bootstrap();
