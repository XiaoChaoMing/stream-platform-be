import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateDepositDto {
  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user making the deposit',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 100.5,
    description: 'The amount of money deposited',
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'paypal',
    description:
      'The payment method used for the deposit (e.g., credit_card, paypal, bank_transfer)',
  })
  @IsString()
  payment_method: string;
}
