import { Injectable, Inject } from '@nestjs/common';

import { IVideoCategoryRepository } from 'src/core/domain/repositories.interface/video-category.repository.interface';
import { VideoCategory } from 'src/core/domain/entities/video-categorys.entity';

@Injectable()
export class GetAllVideoCategoryUseCase {
  constructor(
    @Inject('IVideoCategoryRepository')
    private readonly videoCategoryRepository: IVideoCategoryRepository,
  ) {}

  async getAllVideoCategory(): Promise<VideoCategory[]> {
    const videoCategories = await this.videoCategoryRepository.findAll();
    return videoCategories;
  }
}
