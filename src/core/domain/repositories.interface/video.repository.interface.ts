import { Video } from '../entities/video.entity';
import { CreateVideoDto } from '../dtos/video/create-video.dto';
import { UpdateVideoDto } from '../dtos/video/update-video.dto';

export interface IVideoRepository {
  create(
    data: CreateVideoDto & { view_count: number; upload_date: Date },
  ): Promise<Video>;
  update(videoId: number, data: UpdateVideoDto): Promise<Video>;
  delete(videoId: number): Promise<void>;
  findById(videoId: number): Promise<Video | null>;
  findAll(): Promise<Video[]>;
  findByUserId(userId: number): Promise<Video[]>;
  incrementViewCount(videoId: number): Promise<void>;
}
