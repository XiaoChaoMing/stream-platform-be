import { Inject, Injectable } from '@nestjs/common';
import { ILikeRepository } from '../../../domain/repositories.interface/like.repository.interface';
import { Like } from '../../../domain/entities/like.entity';
import { EntityNotFoundException } from '../../../filters/exceptions/domain.exception';

@Injectable()
export class GetLikesUseCase {
  constructor(
    @Inject('ILikeRepository')
    private readonly likeRepository: ILikeRepository,
  ) {}

  async getByVideoId(videoId: number): Promise<Like[]> {
    const likes = await this.likeRepository.findByVideoId(videoId);
    if (!likes || likes.length === 0) {
      throw new EntityNotFoundException(`No likes found for video ${videoId}`);
    }
    return likes;
  }

  async getByUserId(userId: number): Promise<Like[]> {
    const likes = await this.likeRepository.findByUserId(userId);
    if (!likes || likes.length === 0) {
      throw new EntityNotFoundException(`No likes found for user ${userId}`);
    }
    return likes;
  }

  async checkUserLiked(userId: number, videoId: number): Promise<boolean> {
    return await this.likeRepository.exists(userId, videoId);
  }
}
