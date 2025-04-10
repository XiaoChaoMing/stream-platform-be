import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ICategoryRepository } from '../../core/domain/repositories.interface/category.repository.interface';
import { Category } from '../../core/domain/entities/category.entity';
import { CreateCategoryDto } from '../../core/domain/dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../../core/domain/dtos/category/update-category.dto';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.create({
      data,
    });
    return category;
  }

  async findById(category_id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { category_id },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async update(
    category_id: number,
    data: UpdateCategoryDto,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { category_id },
      data,
    });
  }

  async delete(category_id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { category_id },
    });
  }
}
