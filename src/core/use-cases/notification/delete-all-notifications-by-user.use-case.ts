import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories.interface/notification.repository.interface';

@Injectable()
export class DeleteAllNotificationsByUserUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.notificationRepository.deleteAllByUserId(userId);
  }
}
