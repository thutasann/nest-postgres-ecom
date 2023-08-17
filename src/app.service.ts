import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1 style="text-align: center; font-family: Arial;">👋 Hello from Nest Postgres Ecommerce</h1>';
  }
}
