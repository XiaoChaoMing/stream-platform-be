import { Module } from '@nestjs/common';

import { CategoryRepository } from '../repositories/category.repository';
import { CategoryController } from '../controllers/category.controller';
import { CreateCategoryUseCase } from '../../core/use-cases/category/create-category.use-case';
import { GetAllCategoryUseCase } from '../../core/use-cases/category/get-all-category.use-case';
@Module({
  imports: [],
  controllers: [CategoryController], 
  providers: [
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository, 
    },
    CreateCategoryUseCase,
    GetAllCategoryUseCase,
  ],
  exports: ['ICategoryRepository'],
})
export class CategoryModule {}
