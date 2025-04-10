import { Inject, Injectable } from '@nestjs/common';
import { ILikeRepository } from '../../../domain/repositories.interface/like.repository.interface';
import { CreateLikeDto } from '../../../domain/dtos/like/create-like.dto';
import { Like } from '../../../domain/entities/like.entity';
import {
  EntityAlreadyExistsException,
  ValidationException,
} from '../../../filters/exceptions/domain.exception';

@Injectable()
export class CreateLikeUseCase {
  constructor(
    @Inject('ILikeRepository')
    private readonly likeRepository: ILikeRepository,
  ) {}

  async execute(createLikeDto: CreateLikeDto): Promise<Like> {
    try {
      // Validate input
      this.validateInput(createLikeDto);

      // Check if like already exists
      const exists = await this.likeRepository.exists(
        createLikeDto.user_id,
        createLikeDto.video_id,
      );

      if (exists) {
        throw new EntityAlreadyExistsException('Like for this video');
      }

      // Create like
      return await this.likeRepository.create(createLikeDto);
    } catch (error) {
      if (error instanceof EntityAlreadyExistsException) {
        throw error;
      }
      throw new ValidationException(
        'Failed to create like: ' + error.message,
        error,
      );
    }
  }

  private validateInput(data: CreateLikeDto): void {
    if (!data.user_id || !data.video_id) {
      throw new ValidationException('User ID and Video ID are required');
    }

    if (!Number.isInteger(data.user_id) || data.user_id <= 0) {
      throw new ValidationException('Invalid User ID');
    }

    if (!Number.isInteger(data.video_id) || data.video_id <= 0) {
      throw new ValidationException('Invalid Video ID');
    }
  }
}
