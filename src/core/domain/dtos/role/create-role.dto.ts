import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'streamer',
    description: 'The name of the role (e.g., user, streamer, admin)',
  })
  @IsString()
  role_name: string;

  @ApiProperty({
    example: 'A user who can livestream videos',
    description: 'A brief description of the role',
  })
  @IsString()
  description: string;
}
