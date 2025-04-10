import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { VideoHistoryRepository } from '../repositories/video-history.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add VideoHistoryController when created
  providers: [
    PrismaService,
    {
      provide: 'IVideoHistoryRepository',
      useClass: VideoHistoryRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IVideoHistoryRepository'],
})
export class VideoHistoryModule {}
