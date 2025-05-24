import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import {
  CreateLivestreamUseCase,
  FindLiveLivestreamsUseCase,
  FindActiveLivestreamByUserUseCase,
  FindLivestreamsByStatusUseCase,
  FindLivestreamsByUserUseCase,
  UpdateLivestreamStatusUseCase,
  DeleteLivestreamUseCase,
  DeleteAllLivestreamsByUserUseCase,
  FindLivestreamsByFollowingUseCase,
} from '../../core/use-cases/livestream';
import { CreateLivestreamDto } from '../../core/domain/dtos/livestream/create-livestream.dto';
import { LivestreamResponseDto } from '../../core/domain/dtos/livestream/livestream-response.dto';
import {
  EntityNotFoundException,
  ValidationException,
  DomainException,
} from '../../core/filters/exceptions/domain.exception';
import { UpdateLivestreamDto } from 'src/core/domain/dtos/livestream/update-livestream.dto';
import { UpdateLivestreamStatusDto } from 'src/core/domain/dtos/livestream/update-livestream-status.dto';
import { FindAllLivestreamsUseCase } from 'src/core/use-cases/livestream/find-all-livestream.use-case';

@ApiTags('Livestreams')
@Controller('livestreams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LivestreamController {
  constructor(
    private readonly createLivestreamUseCase: CreateLivestreamUseCase,
    private readonly findLiveLivestreamsUseCase: FindLiveLivestreamsUseCase,
    private readonly findActiveLivestreamByUserUseCase: FindActiveLivestreamByUserUseCase,
    private readonly findLivestreamsByStatusUseCase: FindLivestreamsByStatusUseCase,
    private readonly findLivestreamsByUserUseCase: FindLivestreamsByUserUseCase,
    private readonly updateLivestreamStatusUseCase: UpdateLivestreamStatusUseCase,
    private readonly deleteLivestreamUseCase: DeleteLivestreamUseCase,
    private readonly deleteAllLivestreamsByUserUseCase: DeleteAllLivestreamsByUserUseCase,
    private readonly findLivestreamsByFollowingUseCase: FindLivestreamsByFollowingUseCase,
    private readonly findAllLivestreamsUseCase: FindAllLivestreamsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new livestream' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Livestream created successfully',
    type: LivestreamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createLivestream(
    @Body() createLivestreamDto: CreateLivestreamDto,
  ): Promise<LivestreamResponseDto> {
    try {
      return await this.createLivestreamUseCase.execute(createLivestreamDto);
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new DomainException(
        'Failed to create livestream: ' + error.message,
        error,
      );
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Get all live livestreams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all live livestreams',
    type: [LivestreamResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getLiveLivestreams(): Promise<LivestreamResponseDto[]> {
    try {
      const livestreams = await this.findLiveLivestreamsUseCase.execute();
      if (!livestreams || livestreams.length === 0) {
        throw new EntityNotFoundException('No live livestreams found');
      }
      return livestreams;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        'Failed to fetch live livestreams: ' + error.message,
        error,
      );
    }
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get livestreams by status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return livestreams by status',
    type: [LivestreamResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No livestreams found with specified status',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getLivestreamsByStatus(
    @Param('status') status: 'scheduled' | 'live' | 'ended',
  ): Promise<LivestreamResponseDto[]> {
    try {
      const livestreams = await this.findLivestreamsByStatusUseCase.execute(status);
      if (!livestreams || livestreams.length === 0) {
        throw new EntityNotFoundException(`No livestreams found with status ${status}`);
      }
      return livestreams;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch livestreams with status ${status}: ` + error.message,
        error,
      );
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get livestreams by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user livestreams',
    type: [LivestreamResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No livestreams found for user',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getLivestreamsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<LivestreamResponseDto[]> {
    try {
      const livestreams = await this.findLivestreamsByUserUseCase.execute(userId);
      if (!livestreams || livestreams.length === 0) {
        throw new EntityNotFoundException(`No livestreams found for user ${userId}`);
      }
      return livestreams;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch livestreams for user ${userId}: ` + error.message,
        error,
      );
    }
  }

  @Get('user/:userId/active')
  @ApiOperation({ summary: 'Get active livestream by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return active user livestream',
    type: LivestreamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No active livestream found for user',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getActiveLivestreamByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<LivestreamResponseDto> {
    try {
      const livestream = await this.findActiveLivestreamByUserUseCase.execute(userId);
      if (!livestream) {
        throw new EntityNotFoundException(`No active livestream found for user ${userId}`);
      }
      return livestream;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch active livestream for user ${userId}: ` + error.message,
        error,
      );
    }
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update livestream status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Livestream status updated successfully',
    type: LivestreamResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Livestream not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiBody({ type: UpdateLivestreamStatusDto })
  async updateLivestreamStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdateLivestreamStatusDto,
  ): Promise<LivestreamResponseDto> {
    try {
      const updatedLivestream = await this.updateLivestreamStatusUseCase.execute(id, statusDto.status);
      if (!updatedLivestream) {
        throw new EntityNotFoundException(`Livestream with ID ${id} not found`);
      }
      return updatedLivestream;
    } catch (error) {
      if (error instanceof ValidationException || error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to update livestream status: ` + error.message,
        error,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete livestream' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Livestream deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Livestream not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteLivestream(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.deleteLivestreamUseCase.execute(id);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to delete livestream: ` + error.message,
        error,
      );
    }
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete all livestreams by user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All user livestreams deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteAllLivestreamsByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    try {
      await this.deleteAllLivestreamsByUserUseCase.execute(userId);
    } catch (error) {
      throw new DomainException(
        `Failed to delete user livestreams: ` + error.message,
        error,
      );
    }
  }

  @Get('following/:userId')
  @ApiOperation({ summary: 'Get livestreams from users the specified user is following' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return livestreams from followed users',
    type: [LivestreamResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No livestreams found from followed users',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getLivestreamsByFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('status', new ParseArrayPipe({ items: String, separator: ',' })) status: 'live' | 'scheduled' | 'ended',
  ): Promise<LivestreamResponseDto[]> {
    try {
      const livestreams = await this.findLivestreamsByFollowingUseCase.execute(userId,page, status);
      if (!livestreams || livestreams.length === 0) {
        throw new EntityNotFoundException(`No livestreams found from users followed by user ${userId}`);
      }
      return livestreams;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch livestreams from followed users: ${error.message}`,
        error,
      );
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all livestreams' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all livestreams',
    type: [LivestreamResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No livestreams found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllLivestreams(
  ): Promise<LivestreamResponseDto[]> {
    try {
      const livestreams = await this.findAllLivestreamsUseCase.execute();
      if (!livestreams || livestreams.length === 0) {
          throw new EntityNotFoundException(`No livestreams found`);
      }
      return livestreams;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch livestreams ${error.message}`,
        error,
      );
    }
  }
} 