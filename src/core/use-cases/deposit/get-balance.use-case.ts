import { Inject, Injectable } from '@nestjs/common';
import { IDepositRepository } from '../../domain/repositories.interface/deposit.repository.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('IDepositRepository')
    private readonly depositRepository: IDepositRepository,
  ) {}

  async execute(userId: number): Promise<{ totalBalance: number }> {
    // Lấy tổng số dư hiện tại của người dùng
    const totalBalance = await this.depositRepository.getTotalAmountByUser(userId);

    return { totalBalance };
  }
} 