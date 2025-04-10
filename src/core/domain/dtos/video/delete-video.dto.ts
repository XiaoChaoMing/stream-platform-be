import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsInt } from 'class-validator';

export class DeleteVideoDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the video to be deleted',
  })
  @IsInt()
  @IsNotEmpty()
  video_id: number;
}
