import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class WithdrawFundsDto {
  @ApiProperty({
    example: 50000,
    description: 'The amount of money to withdraw (in VND)',
  })
  @IsNumber()
  @Min(10000)
  amount: number;

  @ApiProperty({
    example: 'bank_transfer',
    description:
      'The payment method used for the withdrawal (e.g., credit_card, paypal, bank_transfer)',
  })
  @IsString()
  payment_method: string;
} 