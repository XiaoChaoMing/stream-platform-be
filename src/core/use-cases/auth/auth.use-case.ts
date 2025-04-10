import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthRepository } from '../../domain/repositories.interface/auth.repository.interface';
import { TokenPayload } from '../../domain/entities/auth.entity';
import { CreateUserUseCase } from '../user/create-user.use-case';
import { CreateProfileUseCase } from '../profile/create-profile.use-case';

// Type for OAuth User
interface OAuthUser {
  id: number;
  username: string;
  email: string;
  role: string | number;
  accessToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async login(username: string, password: string) {
    const user = await this.authRepository.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: TokenPayload = {
      sub: user.user_id,
      username: user.username,
      role: user.role_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role_id,
      },
    };
  }

  async register(
    username: string,
    password: string,
    email: string,
    roleId: number,
  ) {
    const hashedPassword = await this.authRepository.hashPassword(password);
    const newUser = await this.createUserUseCase.execute({
      username,
      password: hashedPassword,
      email,
      role_id: roleId,
    });
    await this.createProfileUseCase.execute({
      user_id: newUser.user_id,
    });

    const payload: TokenPayload = {
      sub: newUser.user_id,
      username: newUser.username,
      role: newUser.role_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role_id,
      },
    };
  }

  async loginWithOAuth(user: OAuthUser) {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      role: typeof user.role === 'string' ? parseInt(user.role, 10) : user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role:
          typeof user.role === 'string' ? parseInt(user.role, 10) : user.role,
      },
    };
  }
}
