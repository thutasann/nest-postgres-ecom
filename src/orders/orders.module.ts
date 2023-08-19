import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrdersProductEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrdersProductEntity,
      ShippingEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
