import { Controller, Get, Param, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { GetAllUserUseCase } from '../../core/use-cases/user/get-all-user.use-case';
import { User } from '../../core/domain/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { EntityNotFoundException } from '../../core/filters/exceptions/domain.exception';
import { GetUserByIdUseCase } from '../../core/use-cases/user/get-user-by-id.use-case';
import { UserResponseDto } from 'src/core/domain/dtos/user/user-response.dto';
import { GetChannelByUserNameUseCase } from 'src/core/use-cases/user/get-channel-by-user-name.use-case';
import { GetRecommendedChannelsUseCase } from 'src/core/use-cases/user/get-recommended-channels.use-case';
import { ChannelDto } from 'src/core/domain/dtos/user/channel.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly getAllUserUseCase: GetAllUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getChannelByUserNameUseCase: GetChannelByUserNameUseCase,
    private readonly getRecommendedChannelsUseCase: GetRecommendedChannelsUseCase,
  ) {}

  @Get('getUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No users found' })
  async getUser(): Promise<User[]> {
    try {
      const users = await this.getAllUserUseCase.getAllUser();
      if (!users || users.length === 0) {
        throw new EntityNotFoundException('Users');
      }
      return users;
    } catch (error) {
      throw new EntityNotFoundException('Users', error);
    }
  }

  @Get('getById/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: number): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByIdUseCase.getUserById(id);
      if (!user) {
        throw new EntityNotFoundException('User');
      }
      return user;
    } catch (error) {
      throw new EntityNotFoundException('User', error);
    }
  }

  @Get('getChannelByUserName/:userName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get channel by user name' })
  @ApiResponse({ status: 200, description: 'Return channel by user name', type: ChannelDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  async getChannelByUserName(@Param('userName') userName: string): Promise<ChannelDto> {
    try {
      const channel = await this.getChannelByUserNameUseCase.getChannelByUserName(userName);
      if (!channel) {
        throw new EntityNotFoundException('Channel');
      }
      return channel;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new EntityNotFoundException(`Channel not found: ${error.message}`, error);
    }
  }

  @Get('recommendedChannels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get recommended channels' })
  @ApiResponse({ status: 200, description: 'Return recommended channels', type: [ChannelDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'userId', required: false, description: 'Current user ID to exclude from recommendations' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of channels to return' })
  async getRecommendedChannels(
    @Query('userId') userId?: number,
    @Query('limit') limit?: number,
  ): Promise<ChannelDto[]> {
    try {
      const channels = await this.getRecommendedChannelsUseCase.execute(userId, limit);
      return channels;
    } catch (error) {
      throw new EntityNotFoundException(`Could not retrieve recommended channels: ${error.message}`, error);
    }
  }
}
