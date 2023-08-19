/* eslint-disable prefer-const */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
  ) {}

  /**
   * Order Create Service
   */
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);
    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;
    const order = await this.orderRepository.save(orderEntity);
    let opEntity: Array<{
      orderId: number;
      productId: number;
      product_quantity: number;
      product_unit_price: number;
    }> = [];
    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const orderId = order.id;
      const productId = createOrderDto.orderedProducts[i].id;
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({
        orderId,
        productId,
        product_quantity,
        product_unit_price,
      });
    }
    const op = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();
    this.logger.debug('OP => ', op);
    return await this.findOne(order.id);
  }

  findAll() {
    return `This action returns all orders`;
  }

  /**
   * Find single order
   */
  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order ${updateOrderDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
