import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
