import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category',
  })
  category_id: number;

  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
  })
  name: string;

  @ApiProperty({
    example: 'Videos related to technology and gadgets',
    description: 'The description of the category',
    required: false,
  })
  description?: string;
}
