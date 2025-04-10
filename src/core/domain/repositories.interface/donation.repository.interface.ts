import { Donation } from '../entities/donation.entity';
import { CreateDonationDto } from '../dtos/donation/create-donation.dto';

export interface IDonationRepository {
  create(data: CreateDonationDto): Promise<Donation>;
  findById(id: number): Promise<Donation | null>;
  findByDonorId(donorId: number): Promise<Donation[]>;
  findByReceiverId(receiverId: number): Promise<Donation[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Donation[]>;
  findByDonorAndDateRange(
    donorId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Donation[]>;
  findByReceiverAndDateRange(
    receiverId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Donation[]>;
  getTotalAmountByDonor(donorId: number): Promise<number>;
  getTotalAmountByReceiver(receiverId: number): Promise<number>;
  getTotalAmountByDateRange(startDate: Date, endDate: Date): Promise<number>;
  delete(id: number): Promise<void>;
  deleteAllByDonorId(donorId: number): Promise<void>;
  deleteAllByReceiverId(receiverId: number): Promise<void>;
}
