import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';
import { IProfileRepository } from 'src/core/domain/repositories.interface/profile.repository.interface';
import { ILivestreamRepository } from 'src/core/domain/repositories.interface/livestream.repository.interface';
import { ICategoryRepository } from 'src/core/domain/repositories.interface/category.repository.interface';
import { ChannelDto } from 'src/core/domain/dtos/user/channel.dto';
// Channel interface definition
export interface IChannel {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  role_id: number;
  stream_link?: string | null;
  donates_link?: string | null;
  
  // Profile related fields
  profile?: {
    name: string;
    description: string | null;
    banner_url: string | null;
    social_links?: Record<string, string>;
  };
  
  // Additional fields for the application context
  is_live?: boolean;
  tags?: string[];
}

@Injectable()
export class GetChannelByUserNameUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
    @Inject('ILivestreamRepository')
    private readonly livestreamRepository: ILivestreamRepository,
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getChannelByUserName(userName: string): Promise<ChannelDto> {
    const user = await this.userRepository.findByUserName(userName);
    const profile = await this.profileRepository.findByUserId(user.user_id);
    const livestreams = await this.livestreamRepository.findByUserId(user.user_id);
    const categories = await this.categoryRepository.findAll();
    
    // mapping
    const channel: ChannelDto = {
      id: user.user_id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role_id: user.role_id,
      stream_link: null, 
      donates_link: null, // Default value
      is_live: false, // Default to false
      tags: categories?.map((category) => category.name) || [], // Handle if categories is null/undefined
    };
    
    // Add livestream data if available
    if (livestreams && livestreams.length > 0) {
      channel.stream_link = livestreams[0].stream_url || null;
      channel.is_live = livestreams[0].status === "live";
    }
    
    // Add profile data if available
    if (profile) {
      channel.profile = {
        name: profile.name,
        description: profile.description,
        banner_url: profile.banner_url,
        social_links: profile.social_links as Record<string, string>,
      };
    }
    
    return channel;
  }
}