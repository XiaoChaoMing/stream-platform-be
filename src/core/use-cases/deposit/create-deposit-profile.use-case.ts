import { Inject, Injectable } from '@nestjs/common';
import { IDepositRepository } from '../../domain/repositories.interface/deposit.repository.interface';
import { CreateDepositDto } from '../../domain/dtos/deposit/create-deposit.dto';
import { Deposit } from '../../domain/entities/deposit.entity';

@Injectable()
export class CreateDepositProfileUseCase {
  constructor(
    @Inject('IDepositRepository')
    private readonly depositRepository: IDepositRepository,
  ) {}

  async execute(data: CreateDepositDto): Promise<Deposit> {
    // Lưu ý: khi tạo profile ban đầu, có thể đặt số tiền ban đầu là 0
    if (!data.amount) {
      data.amount = 0;
    }

    // Tạo deposit record cho người dùng
    return this.depositRepository.create(data);
  }
} 