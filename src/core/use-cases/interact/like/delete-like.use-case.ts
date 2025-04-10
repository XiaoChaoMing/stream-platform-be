import { Inject, Injectable } from '@nestjs/common';
import { ILikeRepository } from '../../../domain/repositories.interface/like.repository.interface';
import {
  EntityNotFoundException,
  DomainException,
} from '../../../filters/exceptions/domain.exception';

@Injectable()
export class DeleteLikeUseCase {
  constructor(
    @Inject('ILikeRepository')
    private readonly likeRepository: ILikeRepository,
  ) {}

  async execute(userId: number, videoId: number): Promise<void> {
    try {
      // Check if like exists
      const exists = await this.likeRepository.exists(userId, videoId);
      if (!exists) {
        throw new EntityNotFoundException('Like');
      }

      // Delete like
      await this.likeRepository.deleteByUserAndVideo(userId, videoId);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        'Failed to delete like: ' + error.message,
        error,
      );
    }
  }
}
