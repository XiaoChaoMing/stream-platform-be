import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';
import { Subscription } from '../../domain/entities/subcribe.entiry';

@Injectable()
export class FindSubscriptionsBySubscriberUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(subscriberId: number): Promise<Subscription[]> {
    return this.subscriptionRepository.findBySubscriberId(subscriberId);
  }
}
