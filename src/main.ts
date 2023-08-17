import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

config();
async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule, {});

  const config = new DocumentBuilder()
    .setTitle('Nest Postgres Ecom')
    .setDescription('This is the Nest Postgress Ecom API')
    .setVersion('1.0')
    .addTag('ecom')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.SERVER_PORT);
  logger.debug(
    `🚀 Server is running on, http://localhost:${process.env.SERVER_PORT}`,
  );
}
bootstrap();
