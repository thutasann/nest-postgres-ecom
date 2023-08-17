import { DataSource, type DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
export const datasSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [],
  logging: false,
  synchronize: true,
};

const dataSource = new DataSource(datasSourceOptions);

export default dataSource;
