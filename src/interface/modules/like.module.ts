import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LikeRepository } from '../repositories/like.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add LikeController when created
  providers: [
    PrismaService,
    {
      provide: 'ILikeRepository',
      useClass: LikeRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['ILikeRepository'],
})
export class LikeModule {}
