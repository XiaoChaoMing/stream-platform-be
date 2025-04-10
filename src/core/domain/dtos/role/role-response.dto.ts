import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the role',
  })
  role_id: number;

  @ApiProperty({
    example: 'streamer',
    description: 'The name of the role (e.g., user, streamer, admin)',
  })
  role_name: string;

  @ApiProperty({
    example: 'A user who can livestream videos',
    description: 'A brief description of the role',
  })
  description: string;

  constructor(partial: Partial<RoleResponseDto>) {
    Object.assign(this, partial);
  }
}
