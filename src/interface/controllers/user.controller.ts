import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllUserUseCase } from '../../core/use-cases/user/get-all-user.use-case';
import { User } from '../../core/domain/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { EntityNotFoundException } from '../../core/filters/exceptions/domain.exception';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly getAllUserUseCase: GetAllUserUseCase) {}

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
}
