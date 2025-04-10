import { Deposit } from '../entities/deposit.entity';
import { CreateDepositDto } from '../dtos/deposit/create-deposit.dto';

export interface IDepositRepository {
  create(data: CreateDepositDto): Promise<Deposit>;
  findById(id: number): Promise<Deposit | null>;
  findByUserId(userId: number): Promise<Deposit[]>;
  findByPaymentMethod(paymentMethod: string): Promise<Deposit[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Deposit[]>;
  findByUserAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Deposit[]>;
  getTotalAmountByUser(userId: number): Promise<number>;
  getTotalAmountByDateRange(startDate: Date, endDate: Date): Promise<number>;
  delete(id: number): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
