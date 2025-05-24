import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from 'src/core/domain/repositories.interface/profile.repository.interface';
import { IUserRepository } from 'src/core/domain/repositories.interface/user.repository.interface';
import { UpdateUserProfileDto } from 'src/core/domain/dtos/profile/update-user-profile.dto';
import { Profile } from 'src/core/domain/entities/profile.entity';
import { User } from 'src/core/domain/entities/user.entity';
import { MinioService } from 'src/infrastructure/minio/minio.service';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    userId: number,
    data: UpdateUserProfileDto,
  ): Promise<{ user: User; profile: Profile }> {
    const currentProfile = await this.profileRepository.findByUserId(userId);
    const currentUser = await this.userRepository.findById(userId);

    if ('avatarFile' in data && data.avatarFile) {
      const avatarUrl = await this.minioService.uploadFile(
        data.avatarFile,
        'avatars'
      );
      

      if (currentUser?.avatar) {
        try {
          await this.minioService.deleteFile(currentUser.avatar);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
        }
      }
      

      data.avatar = avatarUrl;
    }
    

    if ('bannerFile' in data && data.bannerFile) {

      const bannerUrl = await this.minioService.uploadFile(
        data.bannerFile,
        'banners'
      );
      

      if (currentProfile?.banner_url) {
        try {
          await this.minioService.deleteFile(currentProfile.banner_url);
        } catch (error) {
    
          console.error('Error deleting old banner:', error);
        }
      }

      data.banner_url = bannerUrl;
    }
    
    // Remove file objects before saving to database
    if ('avatarFile' in data) delete data.avatarFile;
    if ('bannerFile' in data) delete data.bannerFile;
    
    // Update user and profile with new URLs
    return await this.profileRepository.updateUserAndProfile(userId, data);
  }
}
