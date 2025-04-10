import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUrl, Min } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who uploaded the video',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'Amazing Nature',
    description: 'The title of the video',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A beautiful video showcasing nature scenes.',
    description: 'The description of the video',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/videos/amazing-nature.mp4',
    description: 'The URL of the video file',
  })
  @IsUrl()
  video_url: string;

  @ApiProperty({
    example: 'https://example.com/thumbnails/amazing-nature.jpg',
    description: 'The URL of the video thumbnail',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  thumbnail_url?: string;

  @ApiProperty({
    example: 360,
    description: 'The duration of the video in seconds',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;
}
