import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DepositRepository } from '../repositories/deposit.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add DepositController when created
  providers: [
    PrismaService,
    {
      provide: 'IDepositRepository',
      useClass: DepositRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IDepositRepository'],
})
export class DepositModule {}
