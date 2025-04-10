import { VideoCategory } from '../entities/video-categorys.entity';
import { CreateVideoCategoryDto } from '../dtos/video-category/create-video-category.dto';

export interface IVideoCategoryRepository {
  create(data: CreateVideoCategoryDto): Promise<VideoCategory>;
  findByVideoId(videoId: number): Promise<VideoCategory[]>;
  findByCategoryId(categoryId: number): Promise<VideoCategory[]>;
  exists(videoId: number, categoryId: number): Promise<boolean>;
  delete(videoId: number, categoryId: number): Promise<void>;
  deleteAllByVideoId(videoId: number): Promise<void>;
  deleteAllByCategoryId(categoryId: number): Promise<void>;
  findAll(): Promise<VideoCategory[]>;
}
