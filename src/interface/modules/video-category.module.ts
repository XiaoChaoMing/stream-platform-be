import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { VideoCategoryRepository } from '../repositories/video-category.repository';
import { VideoCategoryController } from '../controllers/video-category.controller';
import { CreateVideoCategoryUseCase } from '../../core/use-cases/video-categorys/create-video-category.use-case';
import { GetAllVideoCategoryUseCase } from '../../core/use-cases/video-categorys/get-all-video-category.use-case';
@Module({
  imports: [PrismaModule],
  controllers: [VideoCategoryController],
  providers: [
    CreateVideoCategoryUseCase,
    {
      provide: 'IVideoCategoryRepository',
      useClass: VideoCategoryRepository,
    },
    GetAllVideoCategoryUseCase,
  ],
  exports: ['IVideoCategoryRepository', CreateVideoCategoryUseCase],
})
export class VideoCategoryModule {}
