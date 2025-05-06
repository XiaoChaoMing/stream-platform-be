import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IProfileRepository } from '../../core/domain/repositories.interface/profile.repository.interface';
import { Profile } from '../../core/domain/entities/profile.entity';
import { CreateProfileDto } from '../../core/domain/dtos/profile/create-profile.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserProfileDto } from 'src/core/domain/dtos/profile/update-user-profile.dto';
import { User } from 'src/core/domain/entities/user.entity';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProfileDto): Promise<Profile> {
    const profile = await this.prisma.profile.create({
      data: {
        user_id: data.user_id,
        name: data.name || '',
        description: data.description,
        banner_url: data.banner_url,
        social_links: data.social_links
          ? JSON.stringify(data.social_links)
          : null,
      },
    });

    return {
      ...profile,
      social_links: profile.social_links
        ? JSON.parse(profile.social_links as string)
        : undefined,
    };
  }

  async findByUserId(user_id: number): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { user_id },
    });

    if (!profile) return null;

    return {
      ...profile,
      social_links: profile.social_links
        ? JSON.parse(profile.social_links as string)
        : undefined,
    };
  }

  async update(profile_id: number, data: Partial<Profile>): Promise<Profile> {
    const updateData: Prisma.ProfileUpdateInput = {
      ...data,
      social_links: data.social_links
        ? JSON.stringify(data.social_links)
        : undefined,
    };

    const profile = await this.prisma.profile.update({
      where: { profile_id },
      data: updateData,
    });

    return {
      ...profile,
      social_links: profile.social_links
        ? JSON.parse(profile.social_links as string)
        : undefined,
    };
  }

  async delete(user_id: number): Promise<void> {
    await this.prisma.profile.delete({
      where: { user_id },
    });
  }
  
  async updateUserAndProfile(userId: number, data: UpdateUserProfileDto): Promise<{ user: User; profile: Profile }> {
    // First check if username is being updated and already exists
    if (data.username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username: data.username,
          user_id: { not: userId } // Exclude current user
        }
      });
      
      if (existingUser) {
        throw new ConflictException(`Username '${data.username}' is already taken`);
      }
    }
    
    // Extract user and profile data
    const userUpdateData: Prisma.UserUpdateInput = {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
    };
    
    // Prepare profile data with JSON stringification for social_links
    const profileUpdateData: Prisma.ProfileUpdateInput = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.banner_url !== undefined && { banner_url: data.banner_url }),
      ...(data.social_links !== undefined && { 
        social_links: JSON.stringify(data.social_links) 
      }),
    };
    
    // Default values for profile creation
    const profileCreateData: Prisma.ProfileCreateInput = {
      user: { connect: { user_id: userId } },
      name: data.name || 'User',
      description: data.description || null,
      banner_url: data.banner_url || null,
      social_links: data.social_links ? JSON.stringify(data.social_links) : null,
    };
    
    // Use a transaction to update both user and profile
    return await this.prisma.$transaction(async (tx) => {
      // Update user
      const updatedUser = await tx.user.update({
        where: { user_id: userId },
        data: userUpdateData,
      });
      
      // Upsert profile (update if exists, create if not)
      const updatedProfile = await tx.profile.upsert({
        where: { user_id: userId },
        update: profileUpdateData,
        create: profileCreateData,
      });
      
      // Parse social_links for response
      const parsedProfile = {
        ...updatedProfile,
        social_links: updatedProfile.social_links
          ? JSON.parse(updatedProfile.social_links as string)
          : undefined,
      } as Profile;
      
      return { user: updatedUser as User, profile: parsedProfile };
    });
  }
}
