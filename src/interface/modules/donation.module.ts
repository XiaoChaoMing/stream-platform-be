import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DonationRepository } from '../repositories/donation.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add DonationController when created
  providers: [
    PrismaService,
    {
      provide: 'IDonationRepository',
      useClass: DonationRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IDonationRepository'],
})
export class DonationModule {}
