import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the chat message',
  })
  message_id: number;

  @ApiProperty({
    example: 10,
    description:
      'The unique identifier of the live stream associated with the message',
  })
  stream_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who sent the message',
  })
  user_id: number;

  @ApiProperty({
    example: 'This is a great stream!',
    description: 'The content of the chat message',
  })
  message_text: string;

  @ApiProperty({
    example: '2024-03-26T10:05:00Z',
    description: 'The timestamp when the message was sent',
  })
  created_at: Date;

  constructor(partial: Partial<ChatMessageResponseDto>) {
    Object.assign(this, partial);
  }
}
