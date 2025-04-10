import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './interface/modules/user.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

import { AuthModule } from './interface/modules/auth.module';
import { ProfileModule } from './interface/modules/profile.module';
import { VideoCategoryModule } from './interface/modules/video-category.module';
import { CategoryModule } from './interface/modules/category.module';
import { VideoModule } from './interface/modules/video.module';
import { InteractModule } from './interface/modules/interact.module';
import { ConfigModule } from '@nestjs/config';
import { WebSocketModule } from './interface/modules/websocket.module';

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
    CategoryModule,
    InteractModule,
    WebSocketModule,
  ],
  providers: [AppService],
})
export class AppModule {}
