import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NotificationRepository } from '../repositories/notification.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add NotificationController when created
  providers: [
    PrismaService,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['INotificationRepository'],
})
export class NotificationModule {}
