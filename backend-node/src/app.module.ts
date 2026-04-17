import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Category } from './categories/category.entity';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseSeeder } from './database/database.seeder';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'mysql'),
        port: Number(configService.get<string>('DB_PORT', '3306')),
        username: configService.get<string>('DB_USERNAME', 'laravel'),
        password: configService.get<string>('DB_PASSWORD', 'secret'),
        database: configService.get<string>('DB_DATABASE', 'ecommerce_node'),
        entities: [User, Category, Product],
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    TypeOrmModule.forFeature([User, Category, Product]),
    AuthModule,
    CategoriesModule,
    ProductsModule,
  ],
  providers: [DatabaseSeeder],
})
export class AppModule {}
