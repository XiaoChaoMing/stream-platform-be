import { Module } from '@nestjs/common';
import { VideoRepository } from '../repositories/video.repository';
import { VideoController } from '../controllers/video.controller';
import { CreateVideoUseCase } from 'src/core/use-cases/video/create-video.use-case';
import { GetVideoUseCase } from 'src/core/use-cases/video/get-video.use-case';
import { UpdateVideoUseCase } from 'src/core/use-cases/video/update-video.use-case';
import { DeleteVideoUseCase } from 'src/core/use-cases/video/delete-video.use-case';
import { IncrementViewCountGateway } from '../gateways/increment-view-count.gateway';
import { WebSocketModule } from './websocket.module';
import { MinioModule } from '../../infrastructure/minio/minio.module';
import { NotificationGateway } from '../gateways/notification.gateway';
import { NotificationRepository } from '../repositories/notification.repository';
import { GetFollowerUseCase } from 'src/core/use-cases/user/get-follower.use-case';
import { CreateNotificationUseCase } from 'src/core/use-cases/notification/create-notification.use-case';
import { FindSubscriptionsBySubscribedToUseCase } from 'src/core/use-cases/subscription/find-subscriptions-by-subscribed-to.use-case';
import { SubscriptionRepository } from '../repositories/subscription.repository';
@Module({
  imports: [WebSocketModule, MinioModule],
  controllers: [VideoController],
  providers: [
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository,
    },
    CreateVideoUseCase,
    GetVideoUseCase,
    UpdateVideoUseCase,
    DeleteVideoUseCase,
    CreateNotificationUseCase,
    FindSubscriptionsBySubscribedToUseCase,
    IncrementViewCountGateway,
    NotificationGateway
  ],
  exports: ['IVideoRepository'],
})
export class VideoModule {}