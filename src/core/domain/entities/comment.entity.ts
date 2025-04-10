import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the comment',
  })
  comment_id: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who made the comment',
  })
  user_id: number;

  @ApiProperty({
    example: 1,
    description:
      'The unique identifier of the video where the comment was posted',
  })
  video_id: number;

  @ApiProperty({
    example: 'This is an amazing video!',
    description: 'The content of the comment',
  })
  comment_text: string;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The timestamp when the comment was created',
  })
  created_at: Date;

  @ApiProperty({
    example: 2,
    description:
      'The ID of the parent comment if this is a reply, otherwise null',
    required: false,
  })
  parent_comment_id?: number;
}
