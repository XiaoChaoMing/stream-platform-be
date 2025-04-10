import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { VideoRepository } from '../repositories/video.repository';
import { VideoController } from '../controllers/video.controller';
import { CreateVideoUseCase } from 'src/core/use-cases/video/create-video.use-case';
import { GetVideoUseCase } from 'src/core/use-cases/video/get-video.use-case';
import { UpdateVideoUseCase } from 'src/core/use-cases/video/update-video.use-case';
import { DeleteVideoUseCase } from 'src/core/use-cases/video/delete-video.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [VideoController], // Add VideoController when created
  providers: [
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository, // Create this repository
    },
    CreateVideoUseCase,
    GetVideoUseCase,
    UpdateVideoUseCase,
    DeleteVideoUseCase,
    // Add use cases when created
  ],
  exports: ['IVideoRepository'],
})
export class VideoModule {}
