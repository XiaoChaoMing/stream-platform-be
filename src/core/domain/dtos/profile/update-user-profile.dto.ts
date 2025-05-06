import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsObject } from 'class-validator';

export class UpdateUserProfileDto {
  // User fields
  @ApiProperty({ description: 'Username', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Existing avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
  
  // Optional file properties (used internally, not for swagger)
  avatarFile?: Express.Multer.File;
  bannerFile?: Express.Multer.File;
  
  // Profile fields
  @ApiProperty({ description: 'Display name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Profile description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Existing banner URL', required: false })
  @IsOptional()
  @IsString()
  banner_url?: string;

  @ApiProperty({ description: 'Social media links', required: false })
  @IsOptional()
  @IsObject()
  social_links?: Record<string, string>;
} 