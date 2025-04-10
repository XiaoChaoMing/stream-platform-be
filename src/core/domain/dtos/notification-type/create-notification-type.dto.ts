import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNotificationTypeDto {
  @ApiProperty({
    example: 'like',
    description:
      'The name of the notification type (e.g., like, comment, subscription, donation)',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Notification when a user likes a video',
    description: 'A brief description of the notification type',
  })
  @IsString()
  description: string;
}
