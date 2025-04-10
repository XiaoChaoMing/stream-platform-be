import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user',
  })
  user_id: number;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
  })
  username: string;

  @Exclude()
  password: string;

  @ApiProperty({
    example: 1,
    description: 'The role ID of the user',
  })
  role_id: number;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The timestamp when the user was created',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The timestamp when the user was last updated',
  })
  updated_at: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
