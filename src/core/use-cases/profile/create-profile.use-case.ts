import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from '../../domain/repositories.interface/profile.repository.interface';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';
import { CreateProfileDto } from '../../domain/dtos/profile/create-profile.dto';
import { Profile } from '../../domain/entities/profile.entity';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateProfileDto): Promise<Profile> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(data.user_id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if profile already exists
    const existingProfile = await this.profileRepository.findByUserId(
      data.user_id,
    );
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    // Create new profile
    return this.profileRepository.create(data);
  }
}
