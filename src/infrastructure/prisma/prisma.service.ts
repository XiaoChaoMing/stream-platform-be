import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService;

  constructor() {
    if (PrismaService.instance) {
      return PrismaService.instance;
    }
    super({
      log: ['error', 'warn'],
    });
    PrismaService.instance = this;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to Prisma');
    } catch (error) {
      console.error('Failed to connect to Prisma:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
