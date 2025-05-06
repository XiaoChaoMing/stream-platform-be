import { Module } from '@nestjs/common';
import { VideoRepository } from '../repositories/video.repository';
import { VideoController } from '../controllers/video.controller';
import { CreateVideoUseCase } from 'src/core/use-cases/video/create-video.use-case';
import { GetVideoUseCase } from 'src/core/use-cases/video/get-video.use-case';
import { UpdateVideoUseCase } from 'src/core/use-cases/video/update-video.use-case';
import { DeleteVideoUseCase } from 'src/core/use-cases/video/delete-video.use-case';
import { IncrementViewCountGateway } from '../gateways/increment-view-count.gateway';
import { WebSocketModule } from './websocket.module';
import { MinioModule } from '../../infrastructure/minio/minio.module';

@Module({
  imports: [WebSocketModule, MinioModule],
  controllers: [VideoController],
  providers: [
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository,
    },
    CreateVideoUseCase,
    GetVideoUseCase,
    UpdateVideoUseCase,
    DeleteVideoUseCase,
    IncrementViewCountGateway,
  ],
  exports: ['IVideoRepository'],
})
export class VideoModule {}