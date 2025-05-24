import { Controller,Delete,Get, Inject, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Notification } from 'src/core/domain/entities/notification.entity';
import { FindNotificationsByUserUseCase } from 'src/core/use-cases/notification/find-notifications-by-user.use-case';
import { MarkNotificationAsReadUseCase } from 'src/core/use-cases/notification/mark-notification-as-read.use-case';
import { DeleteNotificationUseCase } from 'src/core/use-cases/notification/delete-notification.use-case';
import { DeleteAllNotificationsByUserUseCase } from 'src/core/use-cases/notification/delete-all-notifications-by-user.use-case';
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly findNotificationsByUserUseCase: FindNotificationsByUserUseCase,
    private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    private readonly deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly deleteAllNotificationsByUserUseCase: DeleteAllNotificationsByUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Return all notifications',    
    type: [Notification],
  })
  async findAll(@Query('user_id') userId: number, @Query('limit') limit: number, @Query('page') page: number): Promise<{ notifications: Notification[], total: number }> {
    const notifications = await this.findNotificationsByUserUseCase.execute(userId,limit,page);
    return notifications;
  }

  @Put('read')
  @ApiOperation({ summary: 'Read all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Read all notifications',
  })
  async readAll(@Query('notification_id') notificationId: number): Promise<void> {
    await this.markNotificationAsReadUseCase.execute(notificationId);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Delete all notifications',
  })
  async delete(@Query('notification_id') notificationId: number): Promise<void> {
    await this.deleteNotificationUseCase.execute(notificationId);
  }

  @Delete('delete-all')
  @ApiOperation({ summary: 'Delete all notifications' })
  @ApiResponse({
    status: 200,
    description: 'Delete all notifications',
  })
  async deleteAll(@Query('user_id') userId: number): Promise<void> {
    await this.deleteAllNotificationsByUserUseCase.execute(userId);
  }
}
