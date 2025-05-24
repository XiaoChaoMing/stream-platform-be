import { Inject, Injectable } from '@nestjs/common';
import { IVideoRepository } from '../../domain/repositories.interface/video.repository.interface';
import { VideoResponseDto } from '../../domain/dtos/video/video-response.dto';
import { EntityNotFoundException } from '../../filters/exceptions/domain.exception';

@Injectable()
export class GetVideoUseCase {
  constructor(
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async getById(videoId: number): Promise<VideoResponseDto> {
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new EntityNotFoundException('Video');
    }

    return new VideoResponseDto({
      ...video,
      created_at: video.upload_date,
    });
  }

  async getAll(limit?:number,page?:number): Promise<VideoResponseDto[]> {
    const videos = await this.videoRepository.findAll(limit,page);
    return videos.map(
      (video) =>
        new VideoResponseDto({
          ...video,
          created_at: video.upload_date,
        }),
    );
  }

  async getByUserId(userId: number,limit?:number,page?:number): Promise<VideoResponseDto[]> {
    const videos = await this.videoRepository.findByUserId(userId,limit,page);
    return videos.map(
      (video) =>
        new VideoResponseDto({
          ...video,
          created_at: video.upload_date,
        }),
    );
  }
}
