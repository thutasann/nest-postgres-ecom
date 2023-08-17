import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();
async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule, {});

  await app.listen(process.env.SERVER_PORT);
  logger.log(`🚀 Server is running on port, ${process.env.SERVER_PORT}`);
}
bootstrap();
