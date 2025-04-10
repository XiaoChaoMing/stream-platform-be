import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who liked the video',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the liked video',
  })
  @IsNumber()
  video_id: number;
}
