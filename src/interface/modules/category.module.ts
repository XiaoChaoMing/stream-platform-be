import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryController } from '../controllers/category.controller';
import { CreateCategoryUseCase } from '../../core/use-cases/category/create-category.use-case';
import { GetAllCategoryUseCase } from '../../core/use-cases/category/get-all-category.use-case';
@Module({
  imports: [PrismaModule],
  controllers: [CategoryController], // Add CategoryController when created
  providers: [
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository, // Create this repository
    },
    CreateCategoryUseCase,
    GetAllCategoryUseCase,
  ],
  exports: ['ICategoryRepository'],
})
export class CategoryModule {}
