import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CommentRepository } from '../repositories/comment.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add CommentController when created
  providers: [
    PrismaService,
    {
      provide: 'ICommentRepository',
      useClass: CommentRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['ICommentRepository'],
})
export class CommentModule {}
