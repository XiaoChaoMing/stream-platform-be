import { IsNotEmpty, IsInt } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category to be deleted',
  })
  @IsInt()
  @IsNotEmpty()
  category_id: number;
}
