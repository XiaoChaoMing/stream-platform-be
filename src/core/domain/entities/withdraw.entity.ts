import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class Withdraw {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
    description: 'The unique identifier of the withdrawal',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: 'The user ID who requested the withdrawal',
  })
  user_id: number;

  @ApiProperty({
    description: 'The user who requested the withdrawal',
  })
  user?: User;

  @ApiProperty({
    example: 100.50,
    description: 'The amount to withdraw',
  })
  amount: number;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the withdrawal (pending, success, rejected)',
  })
  status: string;

  @ApiProperty({
    example: '2023-05-20T14:30:00Z',
    description: 'The date and time when the withdrawal was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-05-21T09:15:00Z',
    description: 'The date and time when the withdrawal was approved or rejected',
    required: false,
  })
  approvedAt?: Date;
}
