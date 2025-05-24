import { Get, Module } from '@nestjs/common';
import { LivestreamRepository } from '../repositories/livestream.repository';
import { LivestreamController } from '../controllers/livestream.controller';
import { 
  CreateLivestreamUseCase,
  FindLiveLivestreamsUseCase,
  FindActiveLivestreamByUserUseCase,
  FindLivestreamsByStatusUseCase,
  FindLivestreamsByUserUseCase,
  UpdateLivestreamStatusUseCase,
  DeleteLivestreamUseCase,
  DeleteAllLivestreamsByUserUseCase,
  FindLivestreamsByFollowingUseCase
} from '../../core/use-cases/livestream';
import { StreamGateway } from '../gateways/stream.gateway';
import { StartLivestreamUseCase } from 'src/core/use-cases/livestream/start-livestarm.usecase';
import { WebSocketModule } from './websocket.module';
import { MinioModule } from 'src/infrastructure/minio/minio.module';
import { RedisCacheModule } from '../../infrastructure/cache/redis-cache.module';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { FindAllLivestreamsUseCase } from 'src/core/use-cases/livestream/find-all-livestream.use-case';
import { NotificationGateway } from '../gateways/notification.gateway';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationUseCase } from 'src/core/use-cases/notification/create-notification.use-case';
import { FindSubscriptionsBySubscribedToUseCase } from 'src/core/use-cases/subscription/find-subscriptions-by-subscribed-to.use-case';
import { GetFollowerUseCase } from 'src/core/use-cases/user/get-follower.use-case';
import { UserRepository } from '../repositories/user.repository';
@Module({
  imports: [WebSocketModule, MinioModule, RedisCacheModule],
  controllers: [LivestreamController],
  providers: [
    {
      provide: 'ILivestreamRepository',
      useClass: LivestreamRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    StartLivestreamUseCase,
    CreateLivestreamUseCase,
    FindLiveLivestreamsUseCase,
    FindActiveLivestreamByUserUseCase,
    FindAllLivestreamsUseCase,
    FindLivestreamsByStatusUseCase,
    FindLivestreamsByUserUseCase,
    UpdateLivestreamStatusUseCase,
    CreateNotificationUseCase,
    FindSubscriptionsBySubscribedToUseCase,
    DeleteLivestreamUseCase,
    DeleteAllLivestreamsByUserUseCase,
    FindLivestreamsByFollowingUseCase,
    StreamGateway,
    GetFollowerUseCase,
    NotificationGateway
  ],
  exports: ['ILivestreamRepository', 'ISubscriptionRepository'],
})
export class LivestreamModule {}
