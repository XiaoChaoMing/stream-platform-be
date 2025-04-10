import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from '../../domain/dtos/user/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = await this.userRepository.create(data);
    return user;
  }
}
