import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsDate, IsEnum } from 'class-validator';

export class UpdateLivestreamDto {
  @ApiProperty({
    example: 'My First Live Stream',
    description: 'The title of the live stream',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

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
    required: false,
  })
  @IsUrl()
  @IsOptional()
  stream_url?: string;

  @ApiProperty({
    example: '2024-03-26T12:00:00Z',
    description: 'The end time of the live stream (if ended)',
    required: false,
  })
  @IsDate()
  @IsOptional()
  end_time?: Date;

  @ApiProperty({
    example: 'ended',
    description: "The status of the live stream ('scheduled', 'live', 'ended')",
    required: false,
  })
  @IsEnum(['scheduled', 'live', 'ended'])
  @IsOptional()
  status?: 'scheduled' | 'live' | 'ended';
}
