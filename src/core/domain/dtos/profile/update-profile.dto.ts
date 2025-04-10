import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The display name of the user',
    required: false,
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
