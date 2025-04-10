import { Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from '../../../domain/repositories.interface/comment.repository.interface';
import { CreateCommentDto } from '../../../domain/dtos/comment/create-comment.dto';
import { Comment } from '../../../domain/entities/comment.entity';
import { ValidationException } from '../../../filters/exceptions/domain.exception';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      // Validate input
      this.validateInput(createCommentDto);

      // Create comment
      return await this.commentRepository.create({
        ...createCommentDto,
      });
    } catch (error) {
      throw new ValidationException(
        'Failed to create comment: ' + error.message,
        error,
      );
    }
  }

  private validateInput(data: CreateCommentDto): void {
    if (!data.user_id || !data.video_id) {
      throw new ValidationException('User ID and Video ID are required');
    }

    if (!data.comment_text?.trim()) {
      throw new ValidationException('Comment content cannot be empty');
    }

    if (data.comment_text.length > 1000) {
      throw new ValidationException(
        'Comment content is too long (max 1000 characters)',
      );
    }

    if (!Number.isInteger(data.user_id) || data.user_id <= 0) {
      throw new ValidationException('Invalid User ID');
    }

    if (!Number.isInteger(data.video_id) || data.video_id <= 0) {
      throw new ValidationException('Invalid Video ID');
    }
  }
}
