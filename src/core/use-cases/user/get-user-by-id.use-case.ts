import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';
import { User } from 'src/core/domain/entities/user.entity';
import { UserResponseDto } from 'src/core/domain/dtos/user/user-response.dto';
@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    const { password,created_at,updated_at, ...currentUser } = user;
    return currentUser;
  }
}
