import { Module } from '@nestjs/common';
import { DepositController } from '../controllers/deposit.controller';
import { DepositRepository } from '../repositories/deposit.repository';
import {
  CreateDepositProfileUseCase,
  AddFundsUseCase,
  WithdrawFundsUseCase,
  GetBalanceUseCase,
} from '../../core/use-cases/deposit';

@Module({
  imports: [],
  controllers: [DepositController],
  providers: [
    {
      provide: 'IDepositRepository',
      useClass: DepositRepository,
    },
    CreateDepositProfileUseCase,
    AddFundsUseCase,
    WithdrawFundsUseCase,
    GetBalanceUseCase,
  ],
  exports: ['IDepositRepository'],
})
export class DepositModule {}
