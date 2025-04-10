import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IAuthRepository } from '../../core/domain/repositories.interface/auth.repository.interface';
import { UserPayloadDto } from '../../core/domain/dtos/user/user-payload.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserPayloadDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });

    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    return null;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    plainText: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }
}
