import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from 'src/core/domain/repositories.interface/profile.repository.interface';
import { UpdateProfileDto } from 'src/core/domain/dtos/profile/update-profile.dto';
import { Profile } from 'src/core/domain/entities/profile.entity';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async updateProfile(
    profile_id: number,
    data: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.profileRepository.update(profile_id, data);
    return profile;
  }
}
