import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../domain/entities/livestream.entity';

@Injectable()
export class FindAllLivestreamsUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(): Promise<LiveStream[]> {
    return this.livestreamRepository.findAll();
  }
}
