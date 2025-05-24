import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import {
  CreateSubscriptionUseCase,
  FindSubscriptionsBySubscriberUseCase,
  FindSubscriptionsBySubscribedToUseCase,
  DeleteSubscriptionUseCase,
} from '../../core/use-cases/subscription';
import { CreateSubscriptionDto } from '../../core/domain/dtos/subscription/create-subscription.dto';
import { SubscriptionResponseDto } from '../../core/domain/dtos/subscription/subscription-response.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SubscriptionController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly findSubscriptionsBySubscriberUseCase: FindSubscriptionsBySubscriberUseCase,
    private readonly findSubscriptionsBySubscribedToUseCase: FindSubscriptionsBySubscribedToUseCase,
    private readonly deleteSubscriptionUseCase: DeleteSubscriptionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription (follow a user)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Subscription already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    try {
      const subscription = await this.createSubscriptionUseCase.execute(createSubscriptionDto);
      return new SubscriptionResponseDto(subscription);
    } catch (error) {
      if (error.message && error.message.includes('duplicate')) {
        throw new ConflictException('Subscription already exists');
      }
      throw error;
    }
  }

  @Get('subscriber/:subscriberId')
  @ApiOperation({ summary: 'Get all subscriptions by subscriber (get all channels a user follows)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all subscriptions by subscriber',
    type: [SubscriptionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No subscriptions found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getSubscriptionsBySubscriber(
    @Param('subscriberId', ParseIntPipe) subscriberId: number,
  ): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.findSubscriptionsBySubscriberUseCase.execute(subscriberId);
    
    if (!subscriptions || subscriptions.length === 0) {
      throw new NotFoundException(`No subscriptions found for subscriber ${subscriberId}`);
    }

    return subscriptions.map(subscription => new SubscriptionResponseDto(subscription));
  }

  @Get('subscribed-to/:subscribedToId')
  @ApiOperation({ summary: 'Get all subscriptions by subscribed to (get all followers of a channel)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all subscriptions by subscribed to',
    type: [SubscriptionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No subscriptions found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getSubscriptionsBySubscribedTo(
    @Param('subscribedToId', ParseIntPipe) subscribedToId: number,
  ): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.findSubscriptionsBySubscribedToUseCase.execute(subscribedToId);
    
    if (!subscriptions || subscriptions.length === 0) {
      throw new NotFoundException(`No subscriptions found for subscribed to ${subscribedToId}`);
    }

    return subscriptions.map(subscription => new SubscriptionResponseDto(subscription));
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a subscription by ID (unfollow)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Subscription deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subscription not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<void> {
    try {
      await this.deleteSubscriptionUseCase.execute(createSubscriptionDto);
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        throw new NotFoundException(`Subscription with ID ${createSubscriptionDto} not found`);
      }
      throw error;
    }
  }
} 