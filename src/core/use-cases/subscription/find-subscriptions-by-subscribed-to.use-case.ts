import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';
import { Subscription } from '../../domain/entities/subcribe.entiry';

@Injectable()
export class FindSubscriptionsBySubscribedToUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(subscribedToId: number): Promise<Subscription[]> {
    return this.subscriptionRepository.findBySubscribedToId(subscribedToId);
  }
}
