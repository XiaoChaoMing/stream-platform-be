import { ApiProperty } from '@nestjs/swagger';

export class UserPayloadDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user',
  })
  user_id: number;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
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
    example: 'https://example.com/avatar.png',
    description: 'The avatar of the user',
  })
  avatar: string;
}
