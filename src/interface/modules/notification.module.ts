import { Module } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationController } from '../controllers/notification.controller';
import { FindNotificationsByUserUseCase } from 'src/core/use-cases/notification/find-notifications-by-user.use-case';
import { MarkNotificationAsReadUseCase } from 'src/core/use-cases/notification/mark-notification-as-read.use-case';
import { DeleteAllNotificationsByUserUseCase } from 'src/core/use-cases/notification/delete-all-notifications-by-user.use-case';
import { DeleteNotificationUseCase } from 'src/core/use-cases/notification/delete-notification.use-case';

@Module({
  imports: [],
  controllers: [NotificationController], // Add NotificationController when created
  providers: [
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository, // Create this repository
    },
    FindNotificationsByUserUseCase,
    MarkNotificationAsReadUseCase,
    DeleteNotificationUseCase,
    DeleteAllNotificationsByUserUseCase,  
  ],
  exports: ['INotificationRepository'],
})
export class NotificationModule {}
