import { Like } from '../entities/like.entity';
import { CreateLikeDto } from '../dtos/like/create-like.dto';

export interface ILikeRepository {
  create(data: CreateLikeDto): Promise<Like>;
  findById(id: number): Promise<Like | null>;
  findByVideoId(videoId: number): Promise<Like[]>;
  findByUserId(userId: number): Promise<Like[]>;
  exists(userId: number, videoId: number): Promise<boolean>;
  delete(id: number): Promise<void>;
  deleteByUserAndVideo(userId: number, videoId: number): Promise<void>;
}
