import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dtos/notification/create-notification.dto';

export interface INotificationRepository {
  create(data: CreateNotificationDto): Promise<Notification>;
  findById(id: number): Promise<Notification | null>;
  findByUserId(userId: number): Promise<Notification[]>;
  findUnreadByUserId(userId: number): Promise<Notification[]>;
  markAsRead(id: number): Promise<Notification>;
  markAllAsRead(userId: number): Promise<void>;
  update(id: number, data: Partial<Notification>): Promise<Notification>;
  delete(id: number): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
