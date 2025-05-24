import { Module } from '@nestjs/common';
import { UploadController } from '../controllers/upload.controller';
import { MinioModule } from '../../infrastructure/minio/minio.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MinioModule,
    MulterModule.register({
      // Removed direct import of memoryStorage
      // Default storage will be used (memory)
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {} 