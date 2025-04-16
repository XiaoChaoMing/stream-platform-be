import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { CreateLivestreamDto } from '../../domain/dtos/livestream/create-livestream.dto';
import { LiveStream } from '../../domain/entities/livestream.entity';

@Injectable()
export class CreateLivestreamUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(data: CreateLivestreamDto): Promise<LiveStream> {
    return this.livestreamRepository.create(data);
  }
}
