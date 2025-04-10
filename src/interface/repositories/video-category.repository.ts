import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IVideoCategoryRepository } from '../../core/domain/repositories.interface/video-category.repository.interface';
import { VideoCategory } from '../../core/domain/entities/video-categorys.entity';
import { CreateVideoCategoryDto } from '../../core/domain/dtos/video-category/create-video-category.dto';

@Injectable()
export class VideoCategoryRepository implements IVideoCategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVideoCategoryDto): Promise<VideoCategory> {
    return this.prisma.videoCategory.create({
      data,
    });
  }

  async findByVideoId(video_id: number): Promise<VideoCategory[]> {
    return this.prisma.videoCategory.findMany({
      where: { video_id },
    });
  }

  async findByCategoryId(category_id: number): Promise<VideoCategory[]> {
    return this.prisma.videoCategory.findMany({
      where: { category_id },
    });
  }

  async exists(video_id: number, category_id: number): Promise<boolean> {
    const videoCategory = await this.prisma.videoCategory.findFirst({
      where: {
        video_id,
        category_id,
      },
    });
    return !!videoCategory;
  }

  async delete(video_id: number, category_id: number): Promise<void> {
    await this.prisma.videoCategory.delete({
      where: {
        video_id_category_id: {
          video_id,
          category_id,
        },
      },
    });
  }

  async deleteAllByVideoId(video_id: number): Promise<void> {
    await this.prisma.videoCategory.deleteMany({
      where: { video_id },
    });
  }

  async deleteAllByCategoryId(category_id: number): Promise<void> {
    await this.prisma.videoCategory.deleteMany({
      where: { category_id },
    });
  }

  async findAll(): Promise<VideoCategory[]> {
    return this.prisma.videoCategory.findMany();
  }
}
