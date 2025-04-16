import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories.interface/notification.repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class FindUnreadNotificationsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByUserId(userId);
  }
}
