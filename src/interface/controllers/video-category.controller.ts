import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { CreateVideoCategoryDto } from '../../core/domain/dtos/video-category/create-video-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateVideoCategoryUseCase,
  GetAllVideoCategoryUseCase,
} from '../../core/use-cases/video-categorys/index';
import { VideoCategory } from '../../core/domain/entities/video-categorys.entity';

@ApiTags('video-categories')
@Controller('video-categories')
export class VideoCategoryController {
  constructor(
    private readonly createVideoCategoryUseCase: CreateVideoCategoryUseCase,
    private readonly getAllVideoCategoryUseCase: GetAllVideoCategoryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video category relation' })
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
  async create(
    @Body() createDto: CreateVideoCategoryDto,
  ): Promise<VideoCategory> {
    return await this.createVideoCategoryUseCase.execute(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all video categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all video categories',
    type: [VideoCategory],
  })
  async findAll(): Promise<VideoCategory[]> {
    return await this.getAllVideoCategoryUseCase.getAllVideoCategory();
  }
}
