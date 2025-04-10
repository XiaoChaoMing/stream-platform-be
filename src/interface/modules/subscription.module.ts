import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add SubscriptionController when created
  providers: [
    PrismaService,
    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['ISubscriptionRepository'],
})
export class SubscriptionModule {}
