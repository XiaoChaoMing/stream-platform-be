import { Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from '../../../domain/repositories.interface/comment.repository.interface';
import { Comment } from '../../../domain/entities/comment.entity';
import {
  EntityNotFoundException,
  ValidationException,
} from '../../../filters/exceptions/domain.exception';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(id: number, content: string): Promise<Comment> {
    try {
      // Validate input
      this.validateInput(content);

      // Check if comment exists
      const comment = await this.commentRepository.findById(id);
      if (!comment) {
        throw new EntityNotFoundException('Comment');
      }

      // Update comment
      return await this.commentRepository.update(id, {
        comment_text: content,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new ValidationException(
        'Failed to update comment: ' + error.message,
        error,
      );
    }
  }

  private validateInput(content: string): void {
    if (!content?.trim()) {
      throw new ValidationException('Comment content cannot be empty');
    }

    if (content.length > 1000) {
      throw new ValidationException(
        'Comment content is too long (max 1000 characters)',
      );
    }
  }
}
