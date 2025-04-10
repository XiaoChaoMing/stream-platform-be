import { Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from '../../../domain/repositories.interface/comment.repository.interface';
import { Comment } from '../../../domain/entities/comment.entity';
import { EntityNotFoundException } from '../../../filters/exceptions/domain.exception';

@Injectable()
export class GetCommentsUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async getByVideoId(videoId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.findByVideoId(videoId);
    if (!comments || comments.length === 0) {
      throw new EntityNotFoundException(
        `No comments found for video ${videoId}`,
      );
    }
    return comments;
  }

  async getByUserId(userId: number): Promise<Comment[]> {
    const comments = await this.commentRepository.findByUserId(userId);
    if (!comments || comments.length === 0) {
      throw new EntityNotFoundException(`No comments found for user ${userId}`);
    }
    return comments;
  }

  async getReplies(commentId: number): Promise<Comment[]> {
    const replies = await this.commentRepository.findReplies(commentId);
    if (!replies || replies.length === 0) {
      throw new EntityNotFoundException(
        `No replies found for comment ${commentId}`,
      );
    }
    return replies;
  }

  async getById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new EntityNotFoundException('Comment');
    }
    return comment;
  }
}
