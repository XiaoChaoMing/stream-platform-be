import { ApiProperty } from '@nestjs/swagger';

export class DonationResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the donation transaction',
  })
  donation_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who made the donation',
  })
  donor_id: number;

  @ApiProperty({
    example: 10,
    description: 'The unique identifier of the user who received the donation',
  })
  receiver_id: number;

  @ApiProperty({
    example: 50.0,
    description: 'The amount of money donated',
  })
  amount: number;

  @ApiProperty({
    example: '2024-03-26T11:30:00Z',
    description: 'The timestamp when the donation was made',
  })
  donation_date: Date;

  @ApiProperty({
    example: 'Thanks for the great content!',
    description: 'An optional message from the donor',
    required: false,
  })
  note?: string;

  constructor(partial: Partial<DonationResponseDto>) {
    Object.assign(this, partial);
  }
}
