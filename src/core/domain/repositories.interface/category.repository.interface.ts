import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/category/create-category.dto';
import { UpdateCategoryDto } from '../dtos/category/update-category.dto';

export interface ICategoryRepository {
  create(data: CreateCategoryDto): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(id: number, data: UpdateCategoryDto): Promise<Category>;
  delete(id: number): Promise<void>;
}
