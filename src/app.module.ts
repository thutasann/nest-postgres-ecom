import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TypeOrmModule.forRoot(datasSourceOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
