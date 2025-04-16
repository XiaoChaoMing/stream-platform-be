import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../domain/entities/livestream.entity';

@Injectable()
export class FindActiveLivestreamByUserUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(userId: number): Promise<LiveStream | null> {
    return this.livestreamRepository.findActiveByUserId(userId);
  }
}
