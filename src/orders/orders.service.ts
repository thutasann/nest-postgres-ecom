/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './entities/order.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
    private readonly productService: ProductsService,
  ) {}

  /**
   * Private: Stock update
   */
  private async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }

  /**
   * Order Create Service
   */
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippingAddress = shippingEntity;
    orderEntity.user = currentUser;
    const orderTbl = await this.orderRepository.save(orderEntity);

    let opEntity: Array<{
      order: OrderEntity;
      product: ProductEntity;
      product_quantity: number;
      product_unit_price: number;
    }> = [];

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = orderTbl;
      const product = await this.productService.findOne(
        createOrderDto.orderedProducts[i].id,
      );
      const product_quantity =
        createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price =
        createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price,
      });
    }

    const op: InsertResult = await this.opRepository
      .createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();
    this.logger.debug('OP => ', op);

    return await this.findOne(orderTbl.id);
  }

  /**
   * Find All order
   */
  async findAll(): Promise<Array<OrderEntity>> {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true,
        },
      },
    });
  }

  /**
   * Find single order
   */
  async findOne(id: number): Promise<OrderEntity> {
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

  /**
   * Update Order Status
   */
  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity> {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }

    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderStatusDto.status !== OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(`Delivery before shippped !!`);
    }

    if (
      updateOrderStatusDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      return order;
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }

    return order;
  }

  async cancelled(id: number, currentUser: UserEntity): Promise<OrderEntity> {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === OrderStatus.CANCELLED) return order;

    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED);

    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
