import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ description: 'Profile name' })
  name: string;

  @ApiProperty({ description: 'Profile description', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Banner URL', nullable: true })
  banner_url: string | null;

  @ApiProperty({ description: 'Social media links', nullable: true })
  social_links?: Record<string, string>;
}

export class ChannelDto {
  @ApiProperty({ description: 'Channel ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Avatar URL', nullable: true })
  avatar: string | null;

  @ApiProperty({ description: 'Role ID' })
  role_id: number;

  @ApiProperty({ description: 'Stream link', nullable: true })
  stream_link?: string | null;

  @ApiProperty({ description: 'Donations link', nullable: true })
  donates_link?: string | null;
  
  @ApiProperty({ description: 'Profile information', nullable: true, type: ProfileDto })
  profile?: ProfileDto;
  
  @ApiProperty({ description: 'Livestream status', default: false })
  is_live?: boolean;

  @ApiProperty({ description: 'Channel tags', type: [String] })
  tags?: string[];
} 