import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    const usersCount = await this.usersRepository.count();

    if (usersCount === 0) {
      await this.seedUsers();
      this.logger.log('Usuários iniciais criados no backend Node.');
    }

    const categoriesCount = await this.categoriesRepository.count();
    if (categoriesCount === 0) {
      await this.seedCatalog();
      this.logger.log('Catálogo inicial criado no backend Node.');
    }
  }

  private async seedUsers() {
    const password = await hash('password', 10);

    await this.usersRepository.save([
      this.usersRepository.create({
        name: 'Admin',
        email: 'admin@example.com',
        password,
        role: 'admin',
      }),
      this.usersRepository.create({
        name: 'Test User',
        email: 'test@example.com',
        password,
        role: 'user',
      }),
    ]);
  }

  private async seedCatalog() {
    const categories = await this.categoriesRepository.save([
      this.categoriesRepository.create({ name: 'Sneakers' }),
      this.categoriesRepository.create({ name: 'Casual' }),
      this.categoriesRepository.create({ name: 'Running' }),
    ]);

    await this.productsRepository.save([
      this.productsRepository.create({
        name: 'Rock Runner One',
        description: 'Modelo versátil para uso diário com amortecimento leve.',
        price: '349.90',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        category: categories[2],
      }),
      this.productsRepository.create({
        name: 'Street Mid Clay',
        description: 'Silhueta urbana com cabedal estruturado e sola robusta.',
        price: '429.90',
        imageUrl: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80',
        category: categories[1],
      }),
      this.productsRepository.create({
        name: 'Daily Foam Sand',
        description: 'Tênis casual para rotina com paleta neutra e visual limpo.',
        price: '289.90',
        imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
        category: categories[0],
      }),
    ]);
  }
}
