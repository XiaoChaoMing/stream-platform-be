import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketProvider } from '../../infrastructure/websocket/socket.provider';
import { WsAuthGuard } from '../../infrastructure/auth/guards/ws-auth.guard';
import { RedisCacheModule } from '../../infrastructure/cache/redis-cache.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule, RedisCacheModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SocketProvider, WsAuthGuard,],
  exports: [SocketProvider, WsAuthGuard],
})
export class WebSocketModule {}
