import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who made the donation',
  })
  @IsNumber()
  donor_id: number;

  @ApiProperty({
    example: 10,
    description: 'The unique identifier of the user who received the donation',
  })
  @IsNumber()
  receiver_id: number;

  @ApiProperty({
    example: 50.0,
    description: 'The amount of money donated',
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'Thanks for the great content!',
    description: 'An optional message from the donor',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
