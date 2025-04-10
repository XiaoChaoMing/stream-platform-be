import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ICommentRepository } from '../../core/domain/repositories.interface/comment.repository.interface';
import { Comment } from '../../core/domain/entities/comment.entity';
import { CreateCommentDto } from '../../core/domain/dtos/comment/create-comment.dto';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCommentDto): Promise<Comment> {
    return this.prisma.comment.create({
      data,
    });
  }

  async findById(comment_id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { comment_id },
    });
  }

  async findByVideoId(video_id: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { video_id },
    });
  }

  async findByUserId(user_id: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { user_id },
    });
  }

  async findReplies(parent_id: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { parent: { comment_id: parent_id } },
    });
  }

  async update(comment_id: number, data: Partial<Comment>): Promise<Comment> {
    return this.prisma.comment.update({
      where: { comment_id },
      data,
    });
  }

  async delete(comment_id: number): Promise<void> {
    await this.prisma.comment.delete({
      where: { comment_id },
    });
  }
}
