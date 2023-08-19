import { MigrationInterface, QueryRunner } from "typeorm";

export class Refactgor1692463479489 implements MigrationInterface {
    name = 'Refactgor1692463479489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shippings" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shippings" DROP COLUMN "phone"`);
    }

}
