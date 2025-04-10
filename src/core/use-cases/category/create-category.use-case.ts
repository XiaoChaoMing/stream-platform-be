import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import { ICategoryRepository } from 'src/core/domain/repositories.interface/category.repository.interface';
import { CreateCategoryDto } from 'src/core/domain/dtos/category/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(data: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findByName(
      data.name,
    );
    if (existingCategory) {
      throw new Error('Category already exists');
    }

    const category = await this.categoryRepository.create(data);
    return category;
  }
}
