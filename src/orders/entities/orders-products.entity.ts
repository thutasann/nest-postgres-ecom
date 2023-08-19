import { ProductEntity } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'orders_products' })
export class OrdersProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  @Column()
  product_quantity: number;

  @ManyToMany(() => OrderEntity, (order) => order.products)
  order: OrderEntity;

  @ManyToMany(() => ProductEntity, (prod) => prod.products, { cascade: true })
  product: ProductEntity;
}
