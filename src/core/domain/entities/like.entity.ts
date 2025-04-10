import { ApiProperty } from '@nestjs/swagger';

export class Like {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the like',
  })
  like_id: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who liked the video',
  })
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the liked video',
  })
  video_id: number;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The timestamp when the like was created',
  })
  created_at: Date;
}
