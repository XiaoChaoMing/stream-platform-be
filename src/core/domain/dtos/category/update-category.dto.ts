import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Videos related to technology and gadgets',
    description: 'The description of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
