import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../domain/entities/livestream.entity';

@Injectable()
export class FindLivestreamsByStatusUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(status: 'scheduled' | 'live' | 'ended'): Promise<LiveStream[]> {
    return this.livestreamRepository.findByStatus(status);
  }
}
