import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IDepositRepository } from '../../domain/repositories.interface/deposit.repository.interface';
import { CreateDepositDto } from '../../domain/dtos/deposit/create-deposit.dto';
import { Deposit } from '../../domain/entities/deposit.entity';

@Injectable()
export class AddFundsUseCase {
  constructor(
    @Inject('IDepositRepository')
    private readonly depositRepository: IDepositRepository,
  ) {}

  async execute(data: CreateDepositDto): Promise<{ deposit: Deposit; totalBalance: number }> {
    // Kiểm tra số tiền nạp vào phải lớn hơn 0
    if (data.amount <= 0) {
      throw new BadRequestException('Số tiền nạp phải lớn hơn 0');
    }

    // Tạo bản ghi nạp tiền
    const deposit = await this.depositRepository.create(data);

    // Lấy tổng số dư hiện tại của người dùng
    const totalBalance = await this.depositRepository.getTotalAmountByUser(data.user_id);

    return {
      deposit,
      totalBalance,
    };
  }
} 