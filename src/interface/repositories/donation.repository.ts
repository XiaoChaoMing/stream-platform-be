import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IDonationRepository } from '../../core/domain/repositories.interface/donation.repository.interface';
import { Donation } from '../../core/domain/entities/donation.entity';
import { CreateDonationDto } from '../../core/domain/dtos/donation/create-donation.dto';

@Injectable()
export class DonationRepository implements IDonationRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDonationDto): Promise<Donation> {
    const donation = await this.prisma.donations.create({
      data,
    });
    return {
      ...donation,
      amount: Number(donation.amount),
    };
  }

  async findById(donation_id: number): Promise<Donation | null> {
    const donation = await this.prisma.donations.findUnique({
      where: { donation_id },
    });
    return donation
      ? {
          ...donation,
          amount: Number(donation.amount),
        }
      : null;
  }

  async findByDonorId(donor_id: number): Promise<Donation[]> {
    const donations = await this.prisma.donations.findMany({
      where: { donor_id },
    });
    return donations.map((donation) => ({
      ...donation,
      amount: Number(donation.amount),
    }));
  }

  async findByReceiverId(receiver_id: number): Promise<Donation[]> {
    const donations = await this.prisma.donations.findMany({
      where: { receiver_id },
    });
    return donations.map((donation) => ({
      ...donation,
      amount: Number(donation.amount),
    }));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Donation[]> {
    const donations = await this.prisma.donations.findMany({
      where: {
        donation_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return donations.map((donation) => ({
      ...donation,
      amount: Number(donation.amount),
    }));
  }

  async findByDonorAndDateRange(
    donor_id: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Donation[]> {
    const donations = await this.prisma.donations.findMany({
      where: {
        donor_id,
        donation_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return donations.map((donation) => ({
      ...donation,
      amount: Number(donation.amount),
    }));
  }

  async findByReceiverAndDateRange(
    receiver_id: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Donation[]> {
    const donations = await this.prisma.donations.findMany({
      where: {
        receiver_id,
        donation_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return donations.map((donation) => ({
      ...donation,
      amount: Number(donation.amount),
    }));
  }

  async getTotalAmountByDonor(donor_id: number): Promise<number> {
    const result = await this.prisma.donations.aggregate({
      where: { donor_id },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount || 0);
  }

  async getTotalAmountByReceiver(receiver_id: number): Promise<number> {
    const result = await this.prisma.donations.aggregate({
      where: { receiver_id },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount || 0);
  }

  async getTotalAmountByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.prisma.donations.aggregate({
      where: {
        donation_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount || 0);
  }

  async delete(donation_id: number): Promise<void> {
    await this.prisma.donations.delete({
      where: { donation_id },
    });
  }

  async deleteAllByDonorId(donor_id: number): Promise<void> {
    await this.prisma.donations.deleteMany({
      where: { donor_id },
    });
  }

  async deleteAllByReceiverId(receiver_id: number): Promise<void> {
    await this.prisma.donations.deleteMany({
      where: { receiver_id },
    });
  }
}
