import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IProfileRepository } from '../../core/domain/repositories.interface/profile.repository.interface';
import { Profile } from '../../core/domain/entities/profile.entity';
import { CreateProfileDto } from '../../core/domain/dtos/profile/create-profile.dto';
import { Prisma } from '@prisma/client';

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

  async update(user_id: number, data: Partial<Profile>): Promise<Profile> {
    const updateData: Prisma.ProfileUpdateInput = {
      ...data,
      social_links: data.social_links
        ? JSON.stringify(data.social_links)
        : undefined,
    };

    const profile = await this.prisma.profile.update({
      where: { user_id },
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
}
