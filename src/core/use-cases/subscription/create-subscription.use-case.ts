import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';
import { CreateSubscriptionDto } from '../../domain/dtos/subscription/create-subscription.dto';
import { Subscription } from '../../domain/entities/subcribe.entiry';

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(data: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionRepository.create(data);
  }
}
