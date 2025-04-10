import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateVideoCategoryDto {
  @ApiProperty({
    example: 10,
    description: 'The unique identifier of the video',
  })
  @IsNumber()
  video_id: number;

  @ApiProperty({
    example: 3,
    description: 'The unique identifier of the category',
  })
  @IsNumber()
  category_id: number;
}
