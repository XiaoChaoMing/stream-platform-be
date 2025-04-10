import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateVideoHistoryDto {
  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who watched the video',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 12,
    description: 'The unique identifier of the video that was watched',
  })
  @IsNumber()
  video_id: number;
}
