import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IVideoHistoryRepository } from '../../core/domain/repositories.interface/video-history.repository.interface';
import { VideoHistory } from '../../core/domain/entities/video-history.entity';
import { CreateVideoHistoryDto } from '../../core/domain/dtos/video-history/create-video-history.dto';

@Injectable()
export class VideoHistoryRepository implements IVideoHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVideoHistoryDto): Promise<VideoHistory> {
    return this.prisma.videoHistory.create({
      data,
    });
  }

  async findById(history_id: number): Promise<VideoHistory | null> {
    return this.prisma.videoHistory.findUnique({
      where: { history_id },
    });
  }

  async findByUserId(user_id: number): Promise<VideoHistory[]> {
    return this.prisma.videoHistory.findMany({
      where: { user_id },
    });
  }

  async findByVideoId(video_id: number): Promise<VideoHistory[]> {
    return this.prisma.videoHistory.findMany({
      where: { video_id },
    });
  }

  async findByUserAndVideo(
    user_id: number,
    video_id: number,
  ): Promise<VideoHistory | null> {
    return this.prisma.videoHistory.findFirst({
      where: {
        user_id,
        video_id,
      },
    });
  }

  async delete(history_id: number): Promise<void> {
    await this.prisma.videoHistory.delete({
      where: { history_id },
    });
  }

  async deleteAllByUserId(user_id: number): Promise<void> {
    await this.prisma.videoHistory.deleteMany({
      where: { user_id },
    });
  }

  async deleteAllByVideoId(video_id: number): Promise<void> {
    await this.prisma.videoHistory.deleteMany({
      where: { video_id },
    });
  }
}
