import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user receiving the notification',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 10,
    description: 'The unique identifier of the sender (if applicable)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sender_id?: number;

  @ApiProperty({
    example: 2,
    description: 'The unique identifier of the notification type',
  })
  @IsNumber()
  type_id: number;

  @ApiProperty({
    example: 15,
    description:
      'The ID related to the notification (e.g., video_id, comment_id, stream_id, etc.)',
  })
  @IsNumber()
  related_id: number;

  @ApiProperty({
    example: 'Your video has received a new comment!',
    description: 'The content of the notification',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the notification has been read',
  })
  @IsBoolean()
  is_read: boolean;
}
