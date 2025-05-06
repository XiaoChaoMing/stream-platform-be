import { ApiProperty } from '@nestjs/swagger';

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

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
