import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateWithdrawDto {
  @ApiProperty({
    example: 1,
    description: 'The user ID who is requesting the withdrawal',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 100.50,
    description: 'The amount to withdraw (must be positive)',
  })
  @IsNumber()
  @IsPositive()
  @Min(1, { message: 'Withdrawal amount must be at least 1' })
  amount: number;
} 