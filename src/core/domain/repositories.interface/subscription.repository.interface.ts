import { Subscription } from '../entities/subcribe.entiry';
import { CreateSubscriptionDto } from '../dtos/subscription/create-subscription.dto';

export interface ISubscriptionRepository {
  create(data: CreateSubscriptionDto): Promise<Subscription>;
  findById(id: number): Promise<Subscription | null>;
  findBySubscriberId(subscriberId: number): Promise<Subscription[]>;
  findBySubscribedToId(subscribedToId: number): Promise<Subscription[]>;
  countSubscribers(subscribedToId: number): Promise<number>;
  exists(subscriberId: number, subscribedToId: number): Promise<boolean>;
  delete(createSubscriptionDto: CreateSubscriptionDto): Promise<void>;
  deleteBySubscriberAndSubscribedTo(
    subscriberId: number,
    subscribedToId: number,
  ): Promise<void>;
}
