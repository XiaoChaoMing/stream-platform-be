import { Module } from '@nestjs/common';
import { LivestreamRepository } from '../repositories/livestream.repository';
import { LivestreamController } from '../controllers/livestream.controller';
import { 
  CreateLivestreamUseCase,
  FindLiveLivestreamsUseCase,
  FindActiveLivestreamByUserUseCase,
  FindLivestreamsByStatusUseCase,
  FindLivestreamsByUserUseCase,
  UpdateLivestreamStatusUseCase,
  DeleteLivestreamUseCase,
  DeleteAllLivestreamsByUserUseCase
} from '../../core/use-cases/livestream';

@Module({
  imports: [],
  controllers: [LivestreamController],
  providers: [
    {
      provide: 'ILivestreamRepository',
      useClass: LivestreamRepository,
    },
    CreateLivestreamUseCase,
    FindLiveLivestreamsUseCase,
    FindActiveLivestreamByUserUseCase,
    FindLivestreamsByStatusUseCase,
    FindLivestreamsByUserUseCase,
    UpdateLivestreamStatusUseCase,
    DeleteLivestreamUseCase,
    DeleteAllLivestreamsByUserUseCase
  ],
  exports: ['ILivestreamRepository'],
})
export class LivestreamModule {}
