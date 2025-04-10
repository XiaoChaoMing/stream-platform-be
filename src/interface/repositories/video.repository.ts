import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IVideoRepository } from '../../core/domain/repositories.interface/video.repository.interface';
import { Video } from '../../core/domain/entities/video.entity';
import { CreateVideoDto } from '../../core/domain/dtos/video/create-video.dto';
import { UpdateVideoDto } from '../../core/domain/dtos/video/update-video.dto';

@Injectable()
export class VideoRepository implements IVideoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVideoDto): Promise<Video> {
    return this.prisma.video.create({
      data: {
        ...data,
        view_count: 0,
        upload_date: new Date(),
      },
    });
  }

  async findById(video_id: number): Promise<Video | null> {
    return this.prisma.video.findUnique({
      where: { video_id },
    });
  }

  async findByUserId(user_id: number): Promise<Video[]> {
    return this.prisma.video.findMany({
      where: { user_id },
      orderBy: { upload_date: 'desc' },
    });
  }

  async findAll(): Promise<Video[]> {
    return this.prisma.video.findMany({
      orderBy: { upload_date: 'desc' },
    });
  }

  async findMostViewed(limit: number = 10): Promise<Video[]> {
    return this.prisma.video.findMany({
      orderBy: { view_count: 'desc' },
      take: limit,
    });
  }

  async findRecent(limit: number = 10): Promise<Video[]> {
    return this.prisma.video.findMany({
      orderBy: { upload_date: 'desc' },
      take: limit,
    });
  }

  async search(query: string): Promise<Video[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.prisma.video.findMany({
      where: {
        OR: [
          { title: { contains: lowercaseQuery } },
          { description: { contains: lowercaseQuery } },
        ],
      },
      orderBy: { upload_date: 'desc' },
    });
  }

  async update(video_id: number, data: UpdateVideoDto): Promise<Video> {
    return this.prisma.video.update({
      where: { video_id },
      data,
    });
  }

  async incrementViewCount(video_id: number): Promise<void> {
    await this.prisma.video.update({
      where: { video_id },
      data: {
        view_count: {
          increment: 1,
        },
      },
    });
  }

  async delete(video_id: number): Promise<void> {
    await this.prisma.video.delete({
      where: { video_id },
    });
  }

  async deleteAllByUserId(user_id: number): Promise<void> {
    await this.prisma.video.deleteMany({
      where: { user_id },
    });
  }
}
