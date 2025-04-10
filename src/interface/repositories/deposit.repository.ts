import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IDepositRepository } from '../../core/domain/repositories.interface/deposit.repository.interface';
import { Deposit } from '../../core/domain/entities/deposit.entity';
import { CreateDepositDto } from '../../core/domain/dtos/deposit/create-deposit.dto';

@Injectable()
export class DepositRepository implements IDepositRepository {
  constructor(private prisma: PrismaService) {}

  // Helper function to convert Prisma Decimal to number
  private toNumber(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    if (
      typeof value === 'object' &&
      'toNumber' in value &&
      typeof value.toNumber === 'function'
    ) {
      return value.toNumber();
    }

    return Number(value);
  }

  private mapPrismaDepositToEntity(deposit: {
    deposit_id: number;
    user_id: number;
    amount: unknown;
    payment_method: string;
    deposit_date: Date;
  }): Deposit {
    return {
      deposit_id: deposit.deposit_id,
      user_id: deposit.user_id,
      amount: this.toNumber(deposit.amount),
      payment_method: deposit.payment_method,
      deposit_date: deposit.deposit_date,
    };
  }

  async create(data: CreateDepositDto): Promise<Deposit> {
    const deposit = await this.prisma.deposit.create({
      data: {
        user_id: data.user_id,
        amount: data.amount,
        payment_method: data.payment_method,
        // deposit_date will be set by default in DB
      },
    });
    return this.mapPrismaDepositToEntity(deposit);
  }

  async findById(deposit_id: number): Promise<Deposit | null> {
    const deposit = await this.prisma.deposit.findUnique({
      where: { deposit_id },
    });

    return deposit ? this.mapPrismaDepositToEntity(deposit) : null;
  }

  async findByUserId(userId: number): Promise<Deposit[]> {
    const deposits = await this.prisma.deposit.findMany({
      where: { user_id: userId },
      orderBy: { deposit_date: 'desc' },
    });

    return deposits.map((deposit) => this.mapPrismaDepositToEntity(deposit));
  }

  async findByPaymentMethod(paymentMethod: string): Promise<Deposit[]> {
    const deposits = await this.prisma.deposit.findMany({
      where: { payment_method: paymentMethod },
      orderBy: { deposit_date: 'desc' },
    });

    return deposits.map((deposit) => this.mapPrismaDepositToEntity(deposit));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Deposit[]> {
    const deposits = await this.prisma.deposit.findMany({
      where: {
        deposit_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { deposit_date: 'desc' },
    });

    return deposits.map((deposit) => this.mapPrismaDepositToEntity(deposit));
  }

  async findByUserAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Deposit[]> {
    const deposits = await this.prisma.deposit.findMany({
      where: {
        user_id: userId,
        deposit_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { deposit_date: 'desc' },
    });

    return deposits.map((deposit) => this.mapPrismaDepositToEntity(deposit));
  }

  async getTotalAmountByUser(userId: number): Promise<number> {
    const result = await this.prisma.deposit.aggregate({
      where: { user_id: userId },
      _sum: { amount: true },
    });

    return this.toNumber(result._sum.amount) || 0;
  }

  async getTotalAmountByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.deposit.aggregate({
      where: {
        deposit_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { amount: true },
    });

    return this.toNumber(result._sum.amount) || 0;
  }

  async delete(deposit_id: number): Promise<void> {
    await this.prisma.deposit.delete({
      where: { deposit_id },
    });
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    await this.prisma.deposit.deleteMany({
      where: { user_id: userId },
    });
  }
}
