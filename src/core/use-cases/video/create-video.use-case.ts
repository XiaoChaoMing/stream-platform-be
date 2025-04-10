import { Inject, Injectable } from '@nestjs/common';
import { CreateVideoDto } from '../../domain/dtos/video/create-video.dto';
import { VideoResponseDto } from '../../domain/dtos/video/video-response.dto';
import { IVideoRepository } from '../../domain/repositories.interface/video.repository.interface';
import { ValidationException } from '../../filters/exceptions/domain.exception';

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute(createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    try {
      // Additional validation if needed
      this.validateVideoData(createVideoDto);

      // Create video
      const video = await this.videoRepository.create({
        ...createVideoDto,
        view_count: 0,
        upload_date: new Date(),
      });

      // Transform to response DTO
      return new VideoResponseDto({
        ...video,
        created_at: video.upload_date,
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new ValidationException(
        'Failed to create video: ' + error.message,
        error,
      );
    }
  }

  private validateVideoData(data: CreateVideoDto): void {
    if (!data.title?.trim()) {
      throw new ValidationException('Video title cannot be empty');
    }

    if (!data.video_url?.trim()) {
      throw new ValidationException('Video URL cannot be empty');
    }

    if (data.duration !== undefined && data.duration < 0) {
      throw new ValidationException('Video duration cannot be negative');
    }

    // Add any additional validation rules as needed
  }
}
