import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenPayload } from '../../../core/domain/entities/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: payload.sub },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role.role_name,
      avatar: user.avatar,
    };
  }
}
