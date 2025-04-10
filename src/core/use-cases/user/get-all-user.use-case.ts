import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getAllUser(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }
}
