import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from 'src/core/domain/repositories.interface/user.repository.interface';
import { ChangePasswordDto } from 'src/core/domain/dtos/user/change-password.dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: number, data: ChangePasswordDto): Promise<{ success: boolean }> {
    // Use the repository method directly instead of handling the password logic here
    await this.userRepository.changePassword(userId, data.oldPassword, data.newPassword);
    return { success: true };
  }
} 