import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';

@Injectable()
export class CountSubscribersUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(subscribedToId: number): Promise<number> {
    return this.subscriptionRepository.countSubscribers(subscribedToId);
  }
} 