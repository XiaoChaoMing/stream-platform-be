import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 2,
    description: 'The unique identifier of the subscriber (the follower)',
  })
  @IsNumber()
  subscriber_id: number;

  @ApiProperty({
    example: 5,
    description:
      'The unique identifier of the user being subscribed to (the channel owner)',
  })
  @IsNumber()
  subscribed_to_id: number;
}
