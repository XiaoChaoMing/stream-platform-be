import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../domain/entities/livestream.entity';

@Injectable()
export class UpdateLivestreamStatusUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(
    id: number,
    status: 'scheduled' | 'live' | 'ended',
  ): Promise<LiveStream> {
    return this.livestreamRepository.updateStatus(id, status);
  }
}
