import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserProfileWithFilesDto {
  // Profile fields
  @ApiProperty({ description: 'Display name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Profile description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Avatar file (image only)', type: 'string', required: false, format: 'binary' })
  @IsOptional()
  avatarFile?: Express.Multer.File;

  @ApiProperty({ description: 'Banner file (image or video)', type: 'string', required: false, format: 'binary' })
  @IsOptional()
  bannerFile?: Express.Multer.File;

  @ApiProperty({ description: 'Social media links', required: false })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (error) {
      return {};
    }
  })
  social_links?: Record<string, string>;
} 