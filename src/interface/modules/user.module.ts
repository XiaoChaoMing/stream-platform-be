import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../core/use-cases/user/create-user.use-case';
import { UserRepository } from '../repositories/user.repository';
import { GetAllUserUseCase } from 'src/core/use-cases/user/get-all-user.use-case';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: ['IUserRepository', CreateUserUseCase],
})
export class UserModule {}
