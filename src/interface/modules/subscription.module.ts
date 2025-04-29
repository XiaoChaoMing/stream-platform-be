import { Module } from '@nestjs/common';
import { SubscriptionController } from '../controllers/subscription.controller';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import {
  CreateSubscriptionUseCase,
  FindSubscriptionsBySubscriberUseCase,
  FindSubscriptionsBySubscribedToUseCase,
  DeleteSubscriptionUseCase,
} from '../../core/use-cases/subscription';

@Module({
  imports: [],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository,
    },
    CreateSubscriptionUseCase,
    FindSubscriptionsBySubscriberUseCase,
    FindSubscriptionsBySubscribedToUseCase,
    DeleteSubscriptionUseCase,
  ],
  exports: ['ISubscriptionRepository'],
})
export class SubscriptionModule {}
