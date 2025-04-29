import { Module } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';

@Module({
  imports: [],
  controllers: [], // Add LikeController when created
  providers: [
    {
      provide: 'ILikeRepository',
      useClass: LikeRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['ILikeRepository'],
})
export class LikeModule {}
