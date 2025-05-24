import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsDate,
  IsEnum,
} from 'class-validator';

export class CreateLivestreamDto {
  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who is streaming',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'My First Live Stream',
    description: 'The title of the live stream',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A live stream about gaming and entertainment',
    description: 'The description of the live stream',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/live/stream123',
    description: 'The URL where the live stream can be accessed',
  })
  @IsUrl()
  thumbnail: string;

  @ApiProperty({
    example: 'https://example.com/live/stream123',
    description: 'The URL where the live stream can be accessed',
  })
  @IsUrl()
  stream_url: string;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The start time of the live stream',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  start_time: Date;

  @ApiProperty({
    example: 'scheduled',
    description: "The status of the live stream ('scheduled', 'live', 'ended')",
  })
  @IsEnum(['scheduled', 'live', 'ended'])
  status: 'scheduled' | 'live' | 'ended';
}
