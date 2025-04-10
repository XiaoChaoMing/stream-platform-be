import { Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from '../../../domain/repositories.interface/comment.repository.interface';
import {
  EntityNotFoundException,
  DomainException,
} from '../../../filters/exceptions/domain.exception';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    try {
      // Check if comment exists
      const comment = await this.commentRepository.findById(id);
      if (!comment) {
        throw new EntityNotFoundException('Comment');
      }

      // Delete comment
      await this.commentRepository.delete(id);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        'Failed to delete comment: ' + error.message,
        error,
      );
    }
  }
}
