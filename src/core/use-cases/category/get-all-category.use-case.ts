import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from 'src/core/domain/repositories.interface/category.repository.interface';
import { Category } from 'src/core/domain/entities/category.entity';

@Injectable()
export class GetAllCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getAllCategory(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();
    return categories;
  }
}
