import { Module } from '@nestjs/common';
import { DonationRepository } from '../repositories/donation.repository';

@Module({
  imports: [],
  controllers: [], // Add DonationController when created
  providers: [
    {
      provide: 'IDonationRepository',
      useClass: DonationRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IDonationRepository'],
})
export class DonationModule {}
