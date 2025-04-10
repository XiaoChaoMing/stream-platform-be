import { Inject, Injectable } from '@nestjs/common';
import { UpdateVideoDto } from '../../domain/dtos/video/update-video.dto';
import { VideoResponseDto } from '../../domain/dtos/video/video-response.dto';
import { IVideoRepository } from '../../domain/repositories.interface/video.repository.interface';
import {
  EntityNotFoundException,
  ValidationException,
} from '../../filters/exceptions/domain.exception';

@Injectable()
export class UpdateVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute(
    videoId: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    try {
      // Check if video exists
      const existingVideo = await this.videoRepository.findById(videoId);
      if (!existingVideo) {
        throw new EntityNotFoundException('Video');
      }

      // Validate update data
      this.validateUpdateData(updateVideoDto);

      // Update video
      const updatedVideo = await this.videoRepository.update(
        videoId,
        updateVideoDto,
      );

      // Transform to response DTO
      return new VideoResponseDto({
        ...updatedVideo,
        created_at: updatedVideo.upload_date,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new ValidationException(
        'Failed to update video: ' + error.message,
        error,
      );
    }
  }

  private validateUpdateData(data: UpdateVideoDto): void {
    if (data.title !== undefined && !data.title.trim()) {
      throw new ValidationException('Video title cannot be empty');
    }

    if (data.video_url !== undefined && !data.video_url.trim()) {
      throw new ValidationException('Video URL cannot be empty');
    }

    if (data.duration !== undefined && data.duration < 0) {
      throw new ValidationException('Video duration cannot be negative');
    }
  }
}
