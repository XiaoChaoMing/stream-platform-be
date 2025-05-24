import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../domain/entities/livestream.entity';

@Injectable()
export class StartLivestreamUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(
    id: number,
    description: string,
    title: string,
    thumbnail_url: string,
    stream_url: string,
    status: 'scheduled' | 'live' | 'ended',
  ): Promise<LiveStream> {
    const data = {
        id,
        description, 
        title,
        thumbnail_url,
        stream_url,
        status
    }
    return this.livestreamRepository.startStream(data);
  }
}
