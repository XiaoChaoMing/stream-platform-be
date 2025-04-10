import { ApiProperty } from '@nestjs/swagger';

export class Video {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the video',
  })
  video_id: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who uploaded the video',
  })
  user_id: number;

  @ApiProperty({
    example: 'Amazing Nature',
    description: 'The title of the video',
  })
  title: string;

  @ApiProperty({
    example: 'A beautiful video showcasing nature scenes.',
    description: 'The description of the video',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'https://example.com/videos/amazing-nature.mp4',
    description: 'The URL of the video file',
  })
  video_url: string;

  @ApiProperty({
    example: 'https://example.com/thumbnails/amazing-nature.jpg',
    description: 'The URL of the video thumbnail',
    required: false,
  })
  thumbnail_url?: string;

  @ApiProperty({
    example: 360,
    description: 'The duration of the video in seconds',
    required: false,
  })
  duration?: number;

  @ApiProperty({
    example: 0,
    description: 'The number of views the video has received',
  })
  view_count: number;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The upload date and time of the video',
  })
  upload_date: Date;
}
