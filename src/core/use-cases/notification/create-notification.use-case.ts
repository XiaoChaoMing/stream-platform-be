import { Inject, Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories.interface/notification.repository.interface';
import { CreateNotificationDto } from '../../domain/dtos/notification/create-notification.dto';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(data: CreateNotificationDto): Promise<Notification> {
    return this.notificationRepository.create(data);
  }
}
