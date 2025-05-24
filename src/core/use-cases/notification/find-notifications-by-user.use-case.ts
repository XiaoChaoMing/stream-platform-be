import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories.interface/notification.repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class FindNotificationsByUserUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: number,limit: number,page: number): Promise<{ notifications: Notification[], total: number }> {
    return this.notificationRepository.findByUserId(userId,limit,page);
  }
}
