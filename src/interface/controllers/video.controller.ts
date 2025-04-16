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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import {
  CreateVideoUseCase,
  GetVideoUseCase,
  DeleteVideoUseCase,
  UpdateVideoUseCase,
} from '../../core/use-cases/video/index';
import { CreateVideoDto } from '../../core/domain/dtos/video/create-video.dto';
import { UpdateVideoDto } from '../../core/domain/dtos/video/update-video.dto';
import { VideoResponseDto } from '../../core/domain/dtos/video/video-response.dto';
import {
  EntityNotFoundException,
  ValidationException,
  DomainException,
} from '../../core/filters/exceptions/domain.exception';

@ApiTags('Videos')
@Controller('videos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class VideoController {
  constructor(
    private readonly createVideoUseCase: CreateVideoUseCase,
    private readonly updateVideoUseCase: UpdateVideoUseCase,
    private readonly deleteVideoUseCase: DeleteVideoUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Video created successfully',
    type: VideoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createVideo(
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<VideoResponseDto> {
    try {
      return await this.createVideoUseCase.execute(createVideoDto);
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new DomainException(
        'Failed to create video: ' + error.message,
        error,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all videos',
    type: [VideoResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllVideos(): Promise<VideoResponseDto[]> {
    try {
      const videos = await this.getVideoUseCase.getAll();
      if (!videos || videos.length === 0) {
        throw new EntityNotFoundException('No videos found');
      }
      return videos;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        'Failed to fetch videos: ' + error.message,
        error,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the video',
    type: VideoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getVideoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VideoResponseDto> {
    try {
      const video = await this.getVideoUseCase.getById(id);
      if (!video) {
        throw new EntityNotFoundException(`Video with ID ${id} not found`);
      }
      return video;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch video ${id}: ` + error.message,
        error,
      );
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get videos by user ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user videos',
    type: [VideoResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No videos found for user',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getVideosByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<VideoResponseDto[]> {
    try {
      const videos = await this.getVideoUseCase.getByUserId(userId);
      if (!videos || videos.length === 0) {
        throw new EntityNotFoundException(`No videos found for user ${userId}`);
      }
      return videos;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to fetch videos for user ${userId}: ` + error.message,
        error,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update video' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video updated successfully',
    type: VideoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    try {
      const video = await this.updateVideoUseCase.execute(id, updateVideoDto);
      if (!video) {
        throw new EntityNotFoundException(`Video with ID ${id} not found`);
      }
      return video;
    } catch (error) {
      if (
        error instanceof EntityNotFoundException ||
        error instanceof ValidationException
      ) {
        throw error;
      }
      throw new DomainException(
        `Failed to update video ${id}: ` + error.message,
        error,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete video' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Video deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Video not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteVideo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.deleteVideoUseCase.execute(id);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new DomainException(
        `Failed to delete video ${id}: ` + error.message,
        error,
      );
    }
  }
}
