import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IDepositRepository } from '../../domain/repositories.interface/deposit.repository.interface';
import { CreateDepositDto } from '../../domain/dtos/deposit/create-deposit.dto';
import { Deposit } from '../../domain/entities/deposit.entity';

@Injectable()
export class WithdrawFundsUseCase {
  constructor(
    @Inject('IDepositRepository')
    private readonly depositRepository: IDepositRepository,
  ) {}

  async execute(
    userId: number,
    amount: number,
    paymentMethod: string,
  ): Promise<{ deposit: Deposit; totalBalance: number }> {
    const MIN_WITHDRAW_AMOUNT = 10000; // 10.000 VND

    // Kiểm tra số tiền rút phải lớn hơn 10.000 VND
    if (amount < MIN_WITHDRAW_AMOUNT) {
      throw new BadRequestException(`Số tiền rút phải lớn hơn ${MIN_WITHDRAW_AMOUNT} VND`);
    }

    // Lấy tổng số dư hiện tại của người dùng
    const currentBalance = await this.depositRepository.getTotalAmountByUser(userId);

    // Kiểm tra số tiền rút phải nhỏ hơn số dư hiện tại
    if (amount > currentBalance) {
      throw new BadRequestException(
        `Số tiền rút (${amount} VND) vượt quá số dư hiện tại (${currentBalance} VND)`,
      );
    }

    // Tạo bản ghi rút tiền (số tiền âm)
    const withdrawData: CreateDepositDto = {
      user_id: userId,
      amount: -amount, // Số tiền âm để biểu thị rút tiền
      payment_method: paymentMethod,
    };

    const deposit = await this.depositRepository.create(withdrawData);

    // Tính toán số dư mới
    const newBalance = currentBalance - amount;

    return {
      deposit,
      totalBalance: newBalance,
    };
  }
} 