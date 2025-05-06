import { Inject, Injectable } from '@nestjs/common';
import { CreateVideoDto } from '../../domain/dtos/video/create-video.dto';
import { VideoResponseDto } from '../../domain/dtos/video/video-response.dto';
import { IVideoRepository } from '../../domain/repositories.interface/video.repository.interface';
import { ValidationException } from '../../filters/exceptions/domain.exception';
import { MinioService } from '../../../infrastructure/minio/minio.service';

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(createVideoDto: CreateVideoDto): Promise<VideoResponseDto> {
    try {
      // Additional validation if needed
      this.validateVideoData(createVideoDto);

      // Automatically detect video duration if not provided
      let duration = createVideoDto.duration;
      if (duration === undefined && createVideoDto.videoFile) {
        duration = await this.minioService.getVideoDuration(createVideoDto.videoFile);
      }

      // Upload files to MinIO
      const videoUrl = await this.minioService.uploadFile(
        createVideoDto.videoFile,
        'videos',
      );

      let thumbnailUrl = null;
      if (createVideoDto.thumbnailFile) {
        thumbnailUrl = await this.minioService.uploadFile(
          createVideoDto.thumbnailFile,
          'thumbnails',
        );
      }

      // Create video with file URLs
      const video = await this.videoRepository.create({
        user_id: createVideoDto.user_id,
        title: createVideoDto.title,
        description: createVideoDto.description,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration: duration,
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

    if (!data.videoFile) {
      throw new ValidationException('Video file is required');
    }

    if (data.duration !== undefined && data.duration < 0) {
      throw new ValidationException('Video duration cannot be negative');
    }

    // Add any additional validation rules as needed
  }
}
