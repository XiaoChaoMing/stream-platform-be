import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';
import { IProfileRepository } from 'src/core/domain/repositories.interface/profile.repository.interface';
import { ILivestreamRepository } from 'src/core/domain/repositories.interface/livestream.repository.interface';
import { ICategoryRepository } from 'src/core/domain/repositories.interface/category.repository.interface';
import { ISubscriptionRepository } from 'src/core/domain/repositories.interface/subscription.repository.interface';
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
  followers_count: number;
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
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async getChannelByUserName(userName: string): Promise<ChannelDto> {
    const user = await this.userRepository.findByUserName(userName);
    const profile = await this.profileRepository.findByUserId(user.user_id);
    const livestream = await this.livestreamRepository.findByUserId(user.user_id);
    const categories = await this.categoryRepository.findAll();
    const followersCount = await this.subscriptionRepository.countSubscribers(user.user_id);
    
    // mapping
    const channel: ChannelDto = {
      id: user.user_id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role_id: user.role_id,
      donates_link: null, 
      livestream: null,
      tags: categories?.map((category) => category.name) || [], 
      followers_count: followersCount,
    };
    
    // Add livestream data if available
    if (livestream) {
      channel.livestream = livestream[0];
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