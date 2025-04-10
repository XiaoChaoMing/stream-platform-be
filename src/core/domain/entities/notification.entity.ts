import { ApiProperty } from '@nestjs/swagger';

export class Notification {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the notification',
  })
  notification_id: number;

  @ApiProperty({
    example: 5,
    description: 'The unique identifier of the user receiving the notification',
  })
  user_id: number;

  @ApiProperty({
    example: 10,
    description: 'The unique identifier of the sender (if applicable)',
    required: false,
  })
  sender_id?: number;

  @ApiProperty({
    example: 2,
    description: 'The unique identifier of the notification type',
  })
  type_id: number;

  @ApiProperty({
    example: 15,
    description:
      'The ID related to the notification (e.g., video_id, comment_id, stream_id, etc.)',
  })
  related_id: number;

  @ApiProperty({
    example: 'Your video has received a new comment!',
    description: 'The content of the notification',
  })
  message: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the notification has been read',
  })
  is_read: boolean;

  @ApiProperty({
    example: '2024-03-26T14:30:00Z',
    description: 'The timestamp when the notification was created',
  })
  created_at: Date;
}
