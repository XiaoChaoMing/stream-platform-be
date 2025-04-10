import { UserPayloadDto } from '../dtos/user/user-payload.dto';

export interface IAuthRepository {
  validateUser(
    username: string,
    password: string,
  ): Promise<UserPayloadDto | null>;
  hashPassword(password: string): Promise<string>;
  comparePasswords(plainText: string, hashedPassword: string): Promise<boolean>;
}
