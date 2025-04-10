import { ApiProperty } from '@nestjs/swagger';

export class TokenPayload {
  @ApiProperty()
  sub: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: number;
}

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: number;
}

export class AuthResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: UserResponse;
}
