import { MigrationInterface, QueryRunner } from 'typeorm';

export class TblOrders1692462269275 implements MigrationInterface {
  name = 'TblOrders1692462269275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_887ac6f5950113b228bed44a9e6"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "reviewsId"`);
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD "orderId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD "productId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "shippings" ALTER COLUMN "name" SET DEFAULT ' '`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD CONSTRAINT "FK_823bad3524a5d095453c43286bb" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" ADD CONSTRAINT "FK_4eff63e89274f79195e25c5c115" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "FK_4eff63e89274f79195e25c5c115"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "FK_823bad3524a5d095453c43286bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shippings" ALTER COLUMN "name" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP COLUMN "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP COLUMN "orderId"`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "reviewsId" integer`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_887ac6f5950113b228bed44a9e6" FOREIGN KEY ("reviewsId") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
