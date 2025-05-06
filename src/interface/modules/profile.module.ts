import { Module } from '@nestjs/common';
import { ProfileRepository } from '../repositories/profile.repository';
import { CreateProfileUseCase } from '../../core/use-cases/profile/create-profile.use-case';
import { ProfileController } from '../controllers/profile.controller';
import { UserRepository } from '../repositories/user.repository';
import { UserModule } from './user.module';
import { UpdateProfileUseCase } from '../../core/use-cases/profile/update-profile.use-case';
import { GetProfileUseCase } from '../../core/use-cases/profile/get-profile.use-case';
import { ChangePasswordUseCase } from '../../core/use-cases/user/change-password.use-case';
import { MinioModule } from 'src/infrastructure/minio/minio.module';

@Module({
  imports: [UserModule, MinioModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    CreateProfileUseCase,
    UpdateProfileUseCase,
    GetProfileUseCase,
    ChangePasswordUseCase,
  ],
  exports: ['IProfileRepository', CreateProfileUseCase, UpdateProfileUseCase],
})
export class ProfileModule {}
