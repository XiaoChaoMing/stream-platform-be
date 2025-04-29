import {
  Controller,
  Get,
  Post,
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
  CreateDepositProfileUseCase,
  AddFundsUseCase,
  WithdrawFundsUseCase,
  GetBalanceUseCase,
} from '../../core/use-cases/deposit';
import { CreateDepositDto } from '../../core/domain/dtos/deposit/create-deposit.dto';
import { WithdrawFundsDto } from '../../core/domain/dtos/deposit/withdraw-funds.dto';
import { DepositResponseDto } from '../../core/domain/dtos/deposit/deposit-response.dto';

@ApiTags('Deposits')
@Controller('deposits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class DepositController {
  constructor(
    private readonly createDepositProfileUseCase: CreateDepositProfileUseCase,
    private readonly addFundsUseCase: AddFundsUseCase,
    private readonly withdrawFundsUseCase: WithdrawFundsUseCase,
    private readonly getBalanceUseCase: GetBalanceUseCase,
  ) {}

  @Post('profile')
  @ApiOperation({ summary: 'Create a deposit profile for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deposit profile created successfully',
    type: DepositResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createDepositProfile(
    @Body() createDepositDto: CreateDepositDto,
  ): Promise<DepositResponseDto> {
    const deposit = await this.createDepositProfileUseCase.execute(createDepositDto);
    return new DepositResponseDto(deposit);
  }

  @Post('add-funds')
  @ApiOperation({ summary: 'Add funds to a user account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Funds added successfully',
    schema: {
      properties: {
        deposit: { type: 'object', $ref: '#/components/schemas/DepositResponseDto' },
        totalBalance: { type: 'number', example: 150000 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async addFunds(
    @Body() createDepositDto: CreateDepositDto,
  ): Promise<{ deposit: DepositResponseDto; totalBalance: number }> {
    const result = await this.addFundsUseCase.execute(createDepositDto);
    return {
      deposit: new DepositResponseDto(result.deposit),
      totalBalance: result.totalBalance,
    };
  }

  @Post('withdraw/:userId')
  @ApiOperation({ summary: 'Withdraw funds from a user account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Funds withdrawn successfully',
    schema: {
      properties: {
        deposit: { type: 'object', $ref: '#/components/schemas/DepositResponseDto' },
        totalBalance: { type: 'number', example: 100000 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or insufficient funds',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async withdrawFunds(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() withdrawFundsDto: WithdrawFundsDto,
  ): Promise<{ deposit: DepositResponseDto; totalBalance: number }> {
    const result = await this.withdrawFundsUseCase.execute(
      userId,
      withdrawFundsDto.amount,
      withdrawFundsDto.payment_method,
    );
    return {
      deposit: new DepositResponseDto(result.deposit),
      totalBalance: result.totalBalance,
    };
  }

  @Get('balance/:userId')
  @ApiOperation({ summary: 'Get user account balance' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account balance retrieved successfully',
    schema: {
      properties: {
        totalBalance: { type: 'number', example: 150000 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getBalance(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ totalBalance: number }> {
    return this.getBalanceUseCase.execute(userId);
  }
} 