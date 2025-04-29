import { Module } from '@nestjs/common';
import { VideoHistoryRepository } from '../repositories/video-history.repository';

@Module({
  imports: [],
  controllers: [], // Add VideoHistoryController when created
  providers: [
    {
      provide: 'IVideoHistoryRepository',
      useClass: VideoHistoryRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IVideoHistoryRepository'],
})
export class VideoHistoryModule {}
