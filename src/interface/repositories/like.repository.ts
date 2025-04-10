import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ILikeRepository } from '../../core/domain/repositories.interface/like.repository.interface';
import { Like } from '../../core/domain/entities/like.entity';
import { CreateLikeDto } from '../../core/domain/dtos/like/create-like.dto';

@Injectable()
export class LikeRepository implements ILikeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLikeDto): Promise<Like> {
    return this.prisma.like.create({
      data,
    });
  }

  async findById(like_id: number): Promise<Like | null> {
    return this.prisma.like.findUnique({
      where: { like_id },
    });
  }

  async findByVideoId(video_id: number): Promise<Like[]> {
    return this.prisma.like.findMany({
      where: { video_id },
    });
  }

  async findByUserId(user_id: number): Promise<Like[]> {
    return this.prisma.like.findMany({
      where: { user_id },
    });
  }

  async exists(user_id: number, video_id: number): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        user_id,
        video_id,
      },
    });
    return !!like;
  }

  async delete(like_id: number): Promise<void> {
    await this.prisma.like.delete({
      where: { like_id },
    });
  }

  async deleteByUserAndVideo(user_id: number, video_id: number): Promise<void> {
    await this.prisma.like.deleteMany({
      where: {
        user_id,
        video_id,
      },
    });
  }
}
