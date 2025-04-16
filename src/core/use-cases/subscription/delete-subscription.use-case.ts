import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';

@Injectable()
export class DeleteSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
