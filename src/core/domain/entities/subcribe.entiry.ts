import { ApiProperty } from '@nestjs/swagger';

export class Subscription {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the subscription',
  })
  subscription_id: number;

  @ApiProperty({
    example: 2,
    description: 'The unique identifier of the subscriber (the follower)',
  })
  subscriber_id: number;

  @ApiProperty({
    example: 5,
    description:
      'The unique identifier of the user being subscribed to (the channel owner)',
  })
  subscribed_to_id: number;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The timestamp when the subscription was created',
  })
  created_at: Date;
}
