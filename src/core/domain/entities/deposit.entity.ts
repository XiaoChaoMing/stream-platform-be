import { ApiProperty } from '@nestjs/swagger';

export class Deposit {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the deposit transaction',
  })
  deposit_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user making the deposit',
  })
  user_id: number;

  @ApiProperty({
    example: 100.5,
    description: 'The amount of money deposited',
  })
  amount: number;

  @ApiProperty({
    example: 'paypal',
    description:
      'The payment method used for the deposit (e.g., credit_card, paypal, bank_transfer)',
  })
  payment_method: string;

  @ApiProperty({
    example: '2024-03-26T10:15:00Z',
    description: 'The timestamp when the deposit was made',
  })
  deposit_date: Date;
}
