import { Inject, Injectable } from '@nestjs/common';
import { IVideoRepository } from '../../domain/repositories.interface/video.repository.interface';
import {
  EntityNotFoundException,
  DomainException,
} from '../../filters/exceptions/domain.exception';

@Injectable()
export class DeleteVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute(videoId: number): Promise<void> {
    try {
      // Check if video exists
      const video = await this.videoRepository.findById(videoId);
      if (!video) {
        throw new EntityNotFoundException('Video');
      }

      // Delete video
      await this.videoRepository.delete(videoId);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        'Failed to delete video: ' + error.message,
        error,
      );
    }
  }
}
