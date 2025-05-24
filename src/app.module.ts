import { Module } from '@nestjs/common';
import { UserModule } from './interface/modules/user.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

import { AuthModule } from './interface/modules/auth.module';
import { ProfileModule } from './interface/modules/profile.module';
import { VideoCategoryModule } from './interface/modules/video-category.module';
import { CategoryModule } from './interface/modules/category.module';
import { VideoModule } from './interface/modules/video.module';
import { InteractModule } from './interface/modules/interact.module';
import { ConfigModule } from '@nestjs/config';
import { LivestreamModule } from './interface/modules/livestream.module';
import { WebSocketModule } from './interface/modules/websocket.module';
import { ChatMessageModule } from './interface/modules/chat-message.module';
import { DepositModule } from './interface/modules/deposit.module';
import { SubscriptionModule } from './interface/modules/subscription.module';
import { MinioModule } from './infrastructure/minio/minio.module';
import { UploadModule } from './interface/modules/upload.module';
import { NotificationModule } from './interface/modules/notification.module';
import { VnPayModule } from './interface/modules/vn-pay.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProfileModule,
    VideoCategoryModule,
    VideoModule,
    NotificationModule,
    CategoryModule,
    InteractModule,
    WebSocketModule,
    LivestreamModule,
    ChatMessageModule,
    DepositModule,
    SubscriptionModule,
    MinioModule,
    UploadModule,
    VnPayModule
  ],
  providers: [],
})
export class AppModule {}
