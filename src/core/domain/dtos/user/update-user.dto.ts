import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: 1,
    description: 'The role ID of the user',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  role_id?: number;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
