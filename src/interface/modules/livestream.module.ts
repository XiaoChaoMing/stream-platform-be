import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { LivestreamRepository } from '../repositories/livestream.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add LivestreamController when created
  providers: [
    PrismaService,
    {
      provide: 'ILivestreamRepository',
      useClass: LivestreamRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['ILivestreamRepository'],
})
export class LivestreamModule {}
