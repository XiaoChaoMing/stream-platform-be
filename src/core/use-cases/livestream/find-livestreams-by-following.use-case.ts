import { Inject, Injectable } from '@nestjs/common';
import { ILivestreamRepository } from '../../domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../domain/entities/livestream.entity';
import { ISubscriptionRepository } from '../../domain/repositories.interface/subscription.repository.interface';
@Injectable()
export class FindLivestreamsByFollowingUseCase {
  constructor(
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(following_id: number,page: number, status: 'live' | 'scheduled' | 'ended'): Promise<LiveStream[]> {
    // Get all subscriptions for the user
    const subscriptions = await this.subscriptionRepository.findBySubscriberId(following_id);
    
    if (subscriptions.length === 0) {
      return [];
    }
    
    // Collect all promises for finding livestreams
    const livestreamPromises = subscriptions.map((subscription) => 
      this.livestreamRepository.findByUserId(subscription.subscribed_to_id)
    );
    
    // Wait for all livestream queries to resolve
    const livestreamArrays = await Promise.all(livestreamPromises);
    
    // Flatten the array of arrays into a single array of livestreams
    return livestreamArrays.flat();
  }
}
