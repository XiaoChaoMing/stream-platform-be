import { ApiProperty } from '@nestjs/swagger';

export class VideoHistory {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the video watch history entry',
  })
  history_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who watched the video',
  })
  user_id: number;

  @ApiProperty({
    example: 12,
    description: 'The unique identifier of the video that was watched',
  })
  video_id: number;

  @ApiProperty({
    example: '2024-03-26T14:00:00Z',
    description: 'The timestamp when the video was watched',
  })
  watched_at: Date;
}
