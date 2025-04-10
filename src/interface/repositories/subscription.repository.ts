import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ISubscriptionRepository } from '../../core/domain/repositories.interface/subscription.repository.interface';
import { Subscription } from '../../core/domain/entities/subcribe.entiry';
import { CreateSubscriptionDto } from '../../core/domain/dtos/subscription/create-subscription.dto';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubscriptionDto): Promise<Subscription> {
    return this.prisma.subscriptions.create({
      data,
    });
  }

  async findById(subscription_id: number): Promise<Subscription | null> {
    return this.prisma.subscriptions.findUnique({
      where: { subscription_id },
    });
  }

  async findBySubscriberId(subscriber_id: number): Promise<Subscription[]> {
    return this.prisma.subscriptions.findMany({
      where: { subscriber_id },
    });
  }

  async findBySubscribedToId(
    subscribed_to_id: number,
  ): Promise<Subscription[]> {
    return this.prisma.subscriptions.findMany({
      where: { subscribed_to_id },
    });
  }

  async exists(
    subscriber_id: number,
    subscribed_to_id: number,
  ): Promise<boolean> {
    const subscription = await this.prisma.subscriptions.findFirst({
      where: {
        subscriber_id,
        subscribed_to_id,
      },
    });
    return !!subscription;
  }

  async delete(subscription_id: number): Promise<void> {
    await this.prisma.subscriptions.delete({
      where: { subscription_id },
    });
  }

  async deleteBySubscriberAndSubscribedTo(
    subscriber_id: number,
    subscribed_to_id: number,
  ): Promise<void> {
    await this.prisma.subscriptions.deleteMany({
      where: {
        subscriber_id,
        subscribed_to_id,
      },
    });
  }
}
