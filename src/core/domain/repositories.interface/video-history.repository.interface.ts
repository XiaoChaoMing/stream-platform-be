import { VideoHistory } from '../entities/video-history.entity';
import { CreateVideoHistoryDto } from '../dtos/video-history/create-video-history.dto';

export interface IVideoHistoryRepository {
  create(data: CreateVideoHistoryDto): Promise<VideoHistory>;
  findById(id: number): Promise<VideoHistory | null>;
  findByUserId(userId: number): Promise<VideoHistory[]>;
  findByVideoId(videoId: number): Promise<VideoHistory[]>;
  findByUserAndVideo(
    userId: number,
    videoId: number,
  ): Promise<VideoHistory | null>;
  delete(id: number): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
  deleteAllByVideoId(videoId: number): Promise<void>;
}
