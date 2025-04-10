import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who made the comment',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 1,
    description:
      'The unique identifier of the video where the comment was posted',
  })
  @IsNumber()
  video_id: number;

  @ApiProperty({
    example: 'This is an amazing video!',
    description: 'The content of the comment',
  })
  @IsString()
  comment_text: string;

  @ApiProperty({
    example: 2,
    description:
      'The ID of the parent comment if this is a reply, otherwise null',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parent_comment_id?: number;
}
