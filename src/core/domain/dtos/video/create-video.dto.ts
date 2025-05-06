import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVideoDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who uploaded the video',
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
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
    type: 'string',
    format: 'binary',
    description: 'The video file to upload',
  })
  videoFile: Express.Multer.File;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The thumbnail image file to upload',
    required: false,
  })
  @IsOptional()
  thumbnailFile?: Express.Multer.File;
  duration?: number;
}
