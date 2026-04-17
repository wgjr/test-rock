import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const perPage = query.per_page ?? 10;
    const sortMap = {
      created_at: 'product.createdAt',
      name: 'product.name',
      price: 'product.price',
    } as const;
    const sort = query.sort ?? 'created_at';
    const direction = query.direction ?? 'desc';

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (query.category) {
      qb.andWhere('product.category_id = :categoryId', {
        categoryId: query.category,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        { search: `%${query.search.trim()}%` },
      );
    }

    qb.orderBy(sortMap[sort], direction.toUpperCase() as 'ASC' | 'DESC');
    qb.skip((page - 1) * perPage).take(perPage);

    const [products, total] = await qb.getManyAndCount();

    return {
      success: true,
      message: 'Products retrieved successfully.',
      data: products.map((product) => this.serialize(product)),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / perPage)),
        per_page: perPage,
        total,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return {
      success: true,
      message: 'Product retrieved successfully.',
      data: this.serialize(product),
    };
  }

  async create(payload: CreateProductDto) {
    const category = await this.findCategoryOrFail(payload.category_id);

    const product = this.productsRepository.create({
      name: payload.name,
      description: payload.description ?? null,
      price: payload.price.toFixed(2),
      category,
      imageUrl: payload.image_url ?? null,
    });

    const savedProduct = await this.productsRepository.save(product);
    const hydratedProduct = await this.productsRepository.findOneOrFail({
      where: { id: savedProduct.id },
      relations: ['category'],
    });

    return {
      success: true,
      message: 'Product created successfully.',
      data: this.serialize(hydratedProduct),
    };
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (payload.category_id !== undefined) {
      product.category = await this.findCategoryOrFail(payload.category_id);
    }

    if (payload.name !== undefined) {
      product.name = payload.name;
    }

    if (payload.description !== undefined) {
      product.description = payload.description ?? null;
    }

    if (payload.price !== undefined) {
      product.price = payload.price.toFixed(2);
    }

    if (payload.image_url !== undefined) {
      product.imageUrl = payload.image_url ?? null;
    }

    const savedProduct = await this.productsRepository.save(product);

    return {
      success: true,
      message: 'Product updated successfully.',
      data: this.serialize(savedProduct),
    };
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.productsRepository.remove(product);

    return {
      success: true,
      message: 'Product deleted successfully.',
    };
  }

  private async findCategoryOrFail(categoryId: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new UnprocessableEntityException({
        message: 'The selected category id is invalid.',
        errors: {
          category_id: ['The selected category id is invalid.'],
        },
      });
    }

    return category;
  }

  private serialize(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      image_url: product.imageUrl,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
    };
  }
}
