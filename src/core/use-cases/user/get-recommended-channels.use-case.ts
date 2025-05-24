import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories.interface/user.repository.interface';
import { IProfileRepository } from 'src/core/domain/repositories.interface/profile.repository.interface';
import { ILivestreamRepository } from 'src/core/domain/repositories.interface/livestream.repository.interface';
import { ICategoryRepository } from 'src/core/domain/repositories.interface/category.repository.interface';
import { ISubscriptionRepository } from 'src/core/domain/repositories.interface/subscription.repository.interface';
import { ChannelDto } from 'src/core/domain/dtos/user/channel.dto';

@Injectable()
export class GetRecommendedChannelsUseCase {
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

  async execute(currentUserId?: number, limit: number = 10): Promise<ChannelDto[]> {
    // Get all users except the current user
    const users = await this.userRepository.findAll();
    const filteredUsers = currentUserId 
      ? users.filter(user => user.user_id !== currentUserId)
      : users;
    
    // Get a subset of users based on the limit
    const recommendedUsers = filteredUsers.slice(0, limit);
    
    // Get categories for tags
    const categories = await this.categoryRepository.findAll();
    const tags = categories?.map(category => category.name) || [];
    
    // Map to ChannelDto
    const recommendedChannels: ChannelDto[] = [];
    
    for (const user of recommendedUsers) {
      // Get profile and livestream data
      const profile = await this.profileRepository.findByUserId(user.user_id);
      const livestream = await this.livestreamRepository.findByUserId(user.user_id);
      const followersCount = await this.subscriptionRepository.countSubscribers(user.user_id);
      
      // Create channel object
      const channel: ChannelDto = {
        id: user.user_id.toString(),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role_id: user.role_id,
        stream_link: null,
        donates_link: null,
        livestream: null,
        tags: tags,
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
      
      recommendedChannels.push(channel);
    }
    
    return recommendedChannels;
  }
} 