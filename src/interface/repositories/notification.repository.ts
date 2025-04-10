import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { INotificationRepository } from '../../core/domain/repositories.interface/notification.repository.interface';
import { Notification } from '../../core/domain/entities/notification.entity';
import { CreateNotificationDto } from '../../core/domain/dtos/notification/create-notification.dto';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({
      data,
    });
  }

  async findById(notification_id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: { notification_id },
    });
  }

  async findByUserId(user_id: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { user_id },
    });
  }

  async findUnreadByUserId(user_id: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        user_id,
        is_read: false,
      },
    });
  }

  async markAsRead(notification_id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { notification_id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(user_id: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { user_id },
      data: { is_read: true },
    });
  }

  async update(
    notification_id: number,
    data: Partial<Notification>,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      where: { notification_id },
      data,
    });
  }

  async delete(notification_id: number): Promise<void> {
    await this.prisma.notification.delete({
      where: { notification_id },
    });
  }

  async deleteAllByUserId(user_id: number): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: { user_id },
    });
  }
}
