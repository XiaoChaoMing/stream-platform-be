import { ApiProperty } from '@nestjs/swagger';

export class NotificationType {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the notification type',
  })
  type_id: number;

  @ApiProperty({
    example: 'like',
    description:
      'The name of the notification type (e.g., like, comment, subscription, donation)',
  })
  name: string;

  @ApiProperty({
    example: 'Notification when a user likes a video',
    description: 'A brief description of the notification type',
  })
  description: string;
}
