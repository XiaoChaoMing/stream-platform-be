import { Module } from '@nestjs/common';
import { SubscriptionController } from '../controllers/subscription.controller';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import {
  CreateSubscriptionUseCase,
  FindSubscriptionsBySubscriberUseCase,
  FindSubscriptionsBySubscribedToUseCase,
  DeleteSubscriptionUseCase,
  CountSubscribersUseCase,
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
    CountSubscribersUseCase,
  ],
  exports: [
    'ISubscriptionRepository',
    CountSubscribersUseCase,
  ],
})
export class SubscriptionModule {}
