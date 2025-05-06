import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateLivestreamStatusDto {
  @ApiProperty({
    description: 'The new status of the livestream',
    enum: ['scheduled', 'live', 'ended'],
    example: 'live'
  })
  @IsNotEmpty()
  @IsEnum(['scheduled', 'live', 'ended'])
  status: 'scheduled' | 'live' | 'ended';
} 