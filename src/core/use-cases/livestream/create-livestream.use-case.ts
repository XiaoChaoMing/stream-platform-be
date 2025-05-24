import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { CreateLivestreamDto } from '../../domain/dtos/livestream/create-livestream.dto';
import { LiveStream } from '../../domain/entities/livestream.entity';
import { ValidationException } from '../../filters/exceptions/domain.exception';

@Injectable()
export class CreateLivestreamUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
  ) {}

  async execute(data: CreateLivestreamDto): Promise<LiveStream> {
    // Check if user already has any active or scheduled streams
    const existingStreams = await this.livestreamRepository.findByUserId(data.user_id);
    const hasActiveOrScheduledStream = existingStreams.some(
      stream => stream.status === 'live' || stream.status === 'scheduled'
    );

    if (hasActiveOrScheduledStream) {
      throw new ValidationException('User already has an active or scheduled stream. Only one stream per user is allowed.');
    }

    return this.livestreamRepository.create(data);
  }
}
