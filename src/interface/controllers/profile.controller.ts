import { Controller, Get, Param, Put, UseGuards, Body } from '@nestjs/common';

import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProfileUseCase } from 'src/core/use-cases/profile/update-profile.use-case';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from 'src/core/domain/dtos/profile/update-profile.dto';
import { Profile } from 'src/core/domain/entities/profile.entity';
import { GetProfileUseCase } from 'src/core/use-cases/profile/get-profile.use-case';
import { EntityNotFoundException } from '../../core/filters/exceptions/domain.exception';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Put(':profile_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @Param('profile_id') profile_id: number,
    @Body() data: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      const profile = await this.updateProfileUseCase.updateProfile(
        profile_id,
        data,
      );
      if (!profile) {
        throw new EntityNotFoundException('Profile');
      }
      return profile;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new EntityNotFoundException('Profile');
    }
  }

  @Get(':user_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Param('user_id') user_id: number): Promise<Profile> {
    try {
      const profile = await this.getProfileUseCase.getProfile(user_id);
      if (!profile) {
        throw new EntityNotFoundException('Profile');
      }
      return profile;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new EntityNotFoundException('Profile');
    }
  }
}
