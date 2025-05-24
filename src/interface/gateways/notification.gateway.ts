import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { SocketProvider } from '../../infrastructure/websocket/socket.provider';
import { CreateNotificationUseCase } from 'src/core/use-cases/notification/create-notification.use-case';
import { FindSubscriptionsBySubscribedToUseCase } from 'src/core/use-cases/subscription/find-subscriptions-by-subscribed-to.use-case';

export class NotificationGateway implements OnModuleInit {
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: any,
    private readonly findSubscriptionsBySubscribedToUseCase: FindSubscriptionsBySubscribedToUseCase,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
    private readonly socketProvider: SocketProvider,
  ) {}

  onModuleInit() {
    this.subscribeToEvents();
    this.logger.log(
      'NotificationGateway initialized and subscribed to events',
    );
  }
  async handleReciveNotification(notiData: any) {
    try {
      const followers = await this.findSubscriptionsBySubscribedToUseCase.execute(notiData.sender_id);
      followers.forEach(async (follower) => {
        const data = {
          user_id: follower.subscriber_id,
          sender_id: notiData.sender_id,
          type_id: notiData.type_id,
          message: notiData.message,
          is_read: false,
        }
        await this.createNotificationUseCase.execute(data);
        this.socketProvider.server.to(`user_${follower.subscriber_id}`).emit('followerReciveNotification', data);
      
      });
    } catch (error) {
      this.logger.error(`Error sending notifications: ${error.message}`);
      console.error('Notification error:', error);
    }
  }
  

  // Method to subscribe to socket events
  subscribeToEvents(): void {
    this.socketProvider.server.on('connection', (socket) => {
      socket.on('sendNotification', async (notiData: any) => {
        await this.handleReciveNotification(notiData);
      });
    });
  }
}
