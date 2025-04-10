import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  IsObject,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user this profile belongs to',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'The display name of the user',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Content creator passionate about technology',
    description: 'The user profile description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/banners/user1-banner.jpg',
    description: 'URL of the profile banner image',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  banner_url?: string;

  @ApiProperty({
    example: {
      twitter: 'https://twitter.com/johndoe',
      instagram: 'https://instagram.com/johndoe',
    },
    description: 'JSON object containing social media links',
    required: false,
  })
  @IsObject()
  @IsOptional()
  social_links?: Record<string, string>;
}
