import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories.interface/notification.repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(id: number): Promise<Notification> {
    return this.notificationRepository.markAsRead(id);
  }
}
