import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoriesRepository.find({
      order: { name: 'ASC' },
    });

    return {
      success: true,
      message: 'Categories retrieved successfully.',
      data: categories.map((category) => this.serialize(category)),
    };
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return {
      success: true,
      message: 'Category retrieved successfully.',
      data: this.serialize(category),
    };
  }

  async create(payload: CreateCategoryDto) {
    await this.ensureNameIsUnique(payload.name);

    const category = await this.categoriesRepository.save(
      this.categoriesRepository.create(payload),
    );

    return {
      success: true,
      message: 'Category created successfully.',
      data: this.serialize(category),
    };
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    await this.ensureNameIsUnique(payload.name, id);
    category.name = payload.name;

    const savedCategory = await this.categoriesRepository.save(category);

    return {
      success: true,
      message: 'Category updated successfully.',
      data: this.serialize(savedCategory),
    };
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    await this.categoriesRepository.remove(category);

    return {
      success: true,
      message: 'Category deleted successfully.',
    };
  }

  private async ensureNameIsUnique(name: string, ignoreId?: number) {
    const existingCategory = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name })
      .andWhere(ignoreId ? 'category.id != :ignoreId' : '1=1', { ignoreId })
      .getOne();

    if (existingCategory) {
      throw new UnprocessableEntityException({
        message: 'The name has already been taken.',
        errors: {
          name: ['The name has already been taken.'],
        },
      });
    }
  }

  serialize(category: Category) {
    return {
      id: category.id,
      name: category.name,
    };
  }
}
