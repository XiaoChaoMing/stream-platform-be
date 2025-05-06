import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../core/use-cases/user/create-user.use-case';
import { UserRepository } from '../repositories/user.repository';
import { GetAllUserUseCase } from 'src/core/use-cases/user/get-all-user.use-case';
import { GetUserByIdUseCase } from 'src/core/use-cases/user/get-user-by-id.use-case';
import { ProfileRepository } from '../repositories/profile.repository';
import { GetChannelByUserNameUseCase } from 'src/core/use-cases/user/get-channel-by-user-name.use-case';
import { GetRecommendedChannelsUseCase } from 'src/core/use-cases/user/get-recommended-channels.use-case';
import { LivestreamRepository } from '../repositories/livestream.repository';
import { CategoryRepository } from '../repositories/category.repository';
@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    GetUserByIdUseCase,
    GetChannelByUserNameUseCase,
    GetRecommendedChannelsUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
    {
      provide: 'ILivestreamRepository',
      useClass: LivestreamRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],
  exports: ['IUserRepository', CreateUserUseCase],
})
export class UserModule {}
