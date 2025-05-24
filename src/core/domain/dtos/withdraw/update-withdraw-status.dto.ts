import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum WithdrawStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  REJECTED = 'rejected',
}

export class UpdateWithdrawStatusDto {
  @ApiProperty({
    example: 'success',
    description: 'The new status of the withdrawal',
    enum: WithdrawStatus,
  })
  @IsEnum(WithdrawStatus, { message: 'Status must be one of: pending, success, rejected' })
  status: WithdrawStatus;
} 