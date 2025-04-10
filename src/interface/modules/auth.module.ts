import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthRepository } from '../repositories/auth.repository';
import { JwtStrategy } from '../../infrastructure/auth/strategies/jwt.strategy';
import { GoogleStrategy } from '../../infrastructure/auth/strategies/google.strategy';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../../core/use-cases/auth/auth.use-case';
import { CreateUserUseCase } from '../../core/use-cases/user/create-user.use-case';
import { UserRepository } from '../repositories/user.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import { CreateProfileUseCase } from '../../core/use-cases/profile/create-profile.use-case';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    JwtStrategy,
    GoogleStrategy,
    CreateUserUseCase,
    CreateProfileUseCase,
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
