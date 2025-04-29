import { Module } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';

@Module({
  imports: [],
  controllers: [], // Add CommentController when created
  providers: [
    {
      provide: 'ICommentRepository',
      useClass: CommentRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['ICommentRepository'],
})
export class CommentModule {}
