import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get(process.env.REDIS_HOST, 'localhost'),
          port: configService.get(process.env.REDIS_PORT, 6379),
          ttl: configService.get(process.env.REDIS_TTL, 60 * 60 * 24), // default 24 hours
          password: configService.get(process.env.REDIS_PASSWORD, undefined),
          db: configService.get(process.env.REDIS_DB, 0),
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {} 