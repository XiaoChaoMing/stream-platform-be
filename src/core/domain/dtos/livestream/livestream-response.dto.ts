import { ApiProperty } from '@nestjs/swagger';

export class LivestreamResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the live stream',
  })
  stream_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who is streaming',
  })
  user_id: number;

  @ApiProperty({
    example: 'My First Live Stream',
    description: 'The title of the live stream',
  })
  title: string;

  @ApiProperty({
    example: 'A live stream about gaming and entertainment',
    description: 'The description of the live stream',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'https://example.com/live/stream123',
    description: 'The URL where the live stream can be accessed',
    default: '',
  })
  stream_url: string;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The start time of the live stream',
  })
  start_time: Date;

  @ApiProperty({
    example: '2024-03-26T12:00:00Z',
    description: 'The end time of the live stream (if ended)',
    required: false,
  })
  end_time?: Date;

  @ApiProperty({
    example: 'scheduled',
    description: "The status of the live stream ('scheduled', 'live', 'ended')",
  })
  status: 'scheduled' | 'live' | 'ended';

  constructor(partial: Partial<LivestreamResponseDto>) {
    Object.assign(this, partial);
  }
}
