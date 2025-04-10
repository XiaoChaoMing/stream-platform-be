import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from '../../core/use-cases/auth/auth.use-case';
import { LoginDto } from '../../core/domain/dtos/auth/login.dto';
import { RegisterDto } from '../../core/domain/dtos/auth/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponse } from '../../core/domain/entities/auth.entity';
import { GoogleAuthGuard } from '../../infrastructure/auth/guards/google-auth.guard';
import { Response } from 'express';
import {
  InvalidCredentialsException,
  ValidationException,
} from '../../core/filters/exceptions/domain.exception';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch (error) {
      throw new InvalidCredentialsException(error);
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Username or email already exists',
  })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    try {
      return await this.authService.register(
        registerDto.username,
        registerDto.password,
        registerDto.email,
        registerDto.role_id,
      );
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint error
        throw new ValidationException('Username or email already exists');
      }
      throw error;
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth2 authentication' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to Google authorization page',
  })
  async googleAuth() {
    // This route will redirect to Google for authentication
    // The @UseGuards(GoogleAuthGuard) does all the work
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth2 callback' })
  @ApiResponse({
    status: 200,
    description: 'Google OAuth2 authentication successful',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async googleAuthCallback(
    @Req() req,
    @Res() res: Response,
    @Query('swagger') swagger?: string,
  ) {
    try {
      const token = await this.authService.loginWithOAuth(req.user);

      if (swagger === 'true') {
        return res.json(token);
      }

      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token.access_token}`,
      );
    } catch (error) {
      throw new InvalidCredentialsException(error);
    }
  }
}
