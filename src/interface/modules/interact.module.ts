import { Module } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { InteractController } from '../controllers/interact.controller';
import { LikeRepository } from '../repositories/like.repository';
import { GetLikesUseCase } from 'src/core/use-cases/interact/like/get-likes.use-case';
import { CreateLikeUseCase } from 'src/core/use-cases/interact/like/create-like.use-case';
import { GetCommentsUseCase } from 'src/core/use-cases/interact/comment/get-comments.use-case';
import { DeleteLikeUseCase } from 'src/core/use-cases/interact/like/delete-like.use-case';
import { UpdateCommentUseCase } from 'src/core/use-cases/interact/comment/update-comment.use-case';
import { DeleteCommentUseCase } from 'src/core/use-cases/interact/comment/delete-comment.use-case';
import { CreateCommentUseCase } from 'src/core/use-cases/interact/comment/create-comment.use-case';

@Module({
  imports: [],
  controllers: [InteractController], // Add CommentController when created
  providers: [
    {
      provide: 'ICommentRepository',
      useClass: CommentRepository, // Create this repository
    },
    {
      provide: 'ILikeRepository',
      useClass: LikeRepository, // Create this repository
    },
    CreateCommentUseCase,
    DeleteCommentUseCase,
    GetCommentsUseCase,
    UpdateCommentUseCase,
    CreateLikeUseCase,
    DeleteLikeUseCase,
    GetLikesUseCase,
    // Add use cases when created
  ],
  exports: ['ICommentRepository', 'ILikeRepository'],
})
export class InteractModule {}
