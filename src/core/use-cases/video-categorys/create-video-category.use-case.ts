import { Inject, Injectable } from '@nestjs/common';
import { IVideoCategoryRepository } from '../../domain/repositories.interface/video-category.repository.interface';
import { CreateVideoCategoryDto } from '../../domain/dtos/video-category/create-video-category.dto';
import { VideoCategory } from '../../domain/entities/video-categorys.entity';
import {
  EntityAlreadyExistsException,
  ValidationException,
} from '../../filters/exceptions/domain.exception';

@Injectable()
export class CreateVideoCategoryUseCase {
  constructor(
    @Inject('IVideoCategoryRepository')
    private readonly videoCategoryRepository: IVideoCategoryRepository,
  ) {}

  async execute(createDto: CreateVideoCategoryDto): Promise<VideoCategory> {
    // Validate input
    this.validateInput(createDto);

    // Check if relation already exists
    const exists = await this.videoCategoryRepository.exists(
      createDto.video_id,
      createDto.category_id,
    );

    if (exists) {
      throw new EntityAlreadyExistsException('Video category relation');
    }

    // Create new relation
    try {
      return await this.videoCategoryRepository.create(createDto);
    } catch (error) {
      throw new ValidationException(
        'Failed to create video category relation',
        error,
      );
    }
  }

  private validateInput(createDto: CreateVideoCategoryDto): void {
    if (!createDto.video_id || !createDto.category_id) {
      throw new ValidationException(
        'Both video_id and category_id are required',
      );
    }

    if (!Number.isInteger(createDto.video_id) || createDto.video_id <= 0) {
      throw new ValidationException('video_id must be a positive integer');
    }

    if (
      !Number.isInteger(createDto.category_id) ||
      createDto.category_id <= 0
    ) {
      throw new ValidationException('category_id must be a positive integer');
    }
  }
}
