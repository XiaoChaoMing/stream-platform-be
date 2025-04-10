import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the profile',
  })
  profile_id: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user this profile belongs to',
  })
  user_id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'The display name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'Content creator passionate about technology',
    description: 'The user profile description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'https://example.com/banners/user1-banner.jpg',
    description: 'URL of the profile banner image',
    required: false,
  })
  banner_url?: string;

  @ApiProperty({
    example: {
      twitter: 'https://twitter.com/johndoe',
      instagram: 'https://instagram.com/johndoe',
    },
    description: 'JSON object containing social media links',
    required: false,
  })
  social_links?: Record<string, string>;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The date and time when the profile was created',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-03-26T10:00:00Z',
    description: 'The date and time when the profile was last updated',
  })
  updated_at: Date;
}
