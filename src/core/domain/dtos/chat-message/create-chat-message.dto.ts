import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty({
    example: 10,
    description:
      'The unique identifier of the live stream associated with the message',
  })
  @IsNumber()
  stream_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user who sent the message',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'This is a great stream!',
    description: 'The content of the chat message',
  })
  @IsString()
  message_text: string;
}
