import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';
import { CreateSubscriptionDto } from '../../domain/dtos/subscription/create-subscription.dto';
@Injectable()
export class DeleteSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(createSubscriptionDto: CreateSubscriptionDto): Promise<void> {
    await this.subscriptionRepository.delete(createSubscriptionDto);
  }
}
