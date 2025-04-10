import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from 'src/core/domain/repositories.interface/profile.repository.interface';
import { Profile } from 'src/core/domain/entities/profile.entity';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async getProfile(user_id: number): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(user_id);
    return profile;
  }
}
