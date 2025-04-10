import { LiveStream } from '../entities/livestream.entity';
import { CreateLivestreamDto } from '../dtos/livestream/create-livestream.dto';
import { UpdateLivestreamDto } from '../dtos/livestream/update-livestream.dto';

export interface ILivestreamRepository {
  create(data: CreateLivestreamDto): Promise<LiveStream>;
  findById(id: number): Promise<LiveStream | null>;
  findByUserId(userId: number): Promise<LiveStream[]>;
  findActiveByUserId(userId: number): Promise<LiveStream | null>;
  findByStatus(status: 'scheduled' | 'live' | 'ended'): Promise<LiveStream[]>;
  findUpcoming(): Promise<LiveStream[]>;
  findLive(): Promise<LiveStream[]>;
  findEnded(): Promise<LiveStream[]>;
  update(id: number, data: UpdateLivestreamDto): Promise<LiveStream>;
  updateStatus(
    id: number,
    status: 'scheduled' | 'live' | 'ended',
  ): Promise<LiveStream>;
  delete(id: number): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
