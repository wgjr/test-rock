import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'laravel',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'ecommerce_node',
  entities: [User, Category, Product],
});
