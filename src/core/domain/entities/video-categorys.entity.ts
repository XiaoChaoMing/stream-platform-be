import { ApiProperty } from '@nestjs/swagger';

export class VideoCategory {
  @ApiProperty({
    example: 10,
    description: 'The unique identifier of the video',
  })
  video_id: number;

  @ApiProperty({
    example: 3,
    description: 'The unique identifier of the category',
  })
  category_id: number;
}
