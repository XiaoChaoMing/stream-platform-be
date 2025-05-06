import { Controller, Get, Param, Put, UseGuards, Body, HttpStatus, UseInterceptors, UploadedFiles, ConflictException } from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateProfileUseCase } from 'src/core/use-cases/profile/update-profile.use-case';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UpdateUserProfileDto } from 'src/core/domain/dtos/profile/update-user-profile.dto';
import { Profile } from 'src/core/domain/entities/profile.entity';
import { GetProfileUseCase } from 'src/core/use-cases/profile/get-profile.use-case';
import { ChangePasswordUseCase } from 'src/core/use-cases/user/change-password.use-case';
import { ChangePasswordDto } from 'src/core/domain/dtos/user/change-password.dto';
import { EntityNotFoundException, DomainException, UnauthorizedException } from '../../core/filters/exceptions/domain.exception';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileWithFilesDto } from 'src/core/domain/dtos/profile/update-user-profile-with-files.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Put('update/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update user profile', 
    description: 'Upload avatar image and/or banner image/video along with profile information' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserProfileWithFilesDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatarFile', maxCount: 1 },
      { name: 'bannerFile', maxCount: 1 },
    ])
  )
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User or profile not found' })
  @ApiResponse({ status: 409, description: 'Username already exists' })
  async updateUserProfile(
    @Param('userId') userId: number,
    @Body() data: UpdateUserProfileWithFilesDto,
    @UploadedFiles() files: { avatarFile?: Express.Multer.File[], bannerFile?: Express.Multer.File[] }
  ): Promise<{ user: any; profile: Profile }> {
    try {
      // Add files to the DTO if they exist
      if (files?.avatarFile?.length > 0) {
        data.avatarFile = files.avatarFile[0];
      }
      
      if (files?.bannerFile?.length > 0) {
        data.bannerFile = files.bannerFile[0];
      }
      
      // Convert to regular UpdateUserProfileDto to pass to use case
      // Only include necessary properties
      const profileData: UpdateUserProfileDto = {
        username: data.username,
        email: data.email,
        name: data.name,
        description: data.description,
        social_links: data.social_links,
        // Pass through file objects
        avatarFile: data.avatarFile,
        bannerFile: data.bannerFile
      };
      
      const result = await this.updateProfileUseCase.execute(
        userId,
        profileData,
      );
      if (!result) {
        throw new EntityNotFoundException('User or profile');
      }
      return result;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new DomainException(`Failed to update profile: ${error.message}`);
    }
  }

  @Put('change-password/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid password' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('userId') userId: number,
    @Body() data: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    try {
      return await this.changePasswordUseCase.execute(userId, data);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new EntityNotFoundException('User');
      }
      if (error.message === 'Current password is incorrect') {
        throw new UnauthorizedException('Current password is incorrect');
      }
      throw new DomainException(`Failed to change password: ${error.message}`);
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
