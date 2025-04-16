import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VideoCategory } from '../../core/domain/entities/video-categorys.entity';
import { Category } from 'src/core/domain/entities/category.entity';
import {
  CreateCategoryUseCase,
  GetAllCategoryUseCase,
} from 'src/core/use-cases/category/index';

import { CreateCategoryDto } from 'src/core/domain/dtos/category/create-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly CreateCategoryUseCase: CreateCategoryUseCase,
    private readonly GetAllCategoryUseCase: GetAllCategoryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category relation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created',
    type: VideoCategory,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Relation already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createDto: CreateCategoryDto): Promise<Category> {
    return await this.CreateCategoryUseCase.execute(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories',
    type: [VideoCategory],
  })
  async findAll(): Promise<Category[]> {
    return await this.GetAllCategoryUseCase.getAllCategory();
  }
}
