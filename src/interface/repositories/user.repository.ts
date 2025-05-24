import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IUserRepository } from '../../core/domain/repositories.interface/user.repository.interface';
import { User } from '../../core/domain/entities/user.entity';
import { CreateUserDto } from '../../core/domain/dtos/user/create-user.dto';
import { Prisma, User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
        role: {
          connect: {
            role_id: data.role_id,
          },
        },
      },
    });
    return this.mapToDomainUser(user);
  }

  async findById(user_id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });
    return user 
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.mapToDomainUser(user) : null;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username: userName },
    });
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async update(user_id: number, data: Partial<User>): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id: _id, ...updateData } = data;
    const user = await this.prisma.user.update({
      where: { user_id },
      data: updateData as Prisma.UserUpdateInput,
    });
    return this.mapToDomainUser(user);
  }

  async delete(user_id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { user_id },
    });
  }
  
  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    // Find the user
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await this.prisma.user.update({
      where: { user_id: userId },
      data: { password: hashedPassword },
    });
    
    return true;
  }

  async findFollowers(userId: number): Promise<{ follower_id: number, following_id: number }[]> {
    const followers = await this.prisma.subscriptions.findMany({
      where: {
        subscribed_to_id: userId
      },
      select: {
        subscriber_id: true,
        subscribed_to_id: true
      }
    });
    
    return followers.map(follow => ({ follower_id: follow.subscriber_id, following_id: follow.subscribed_to_id }));
  }

  private mapToDomainUser(prismaUser: PrismaUser): User {
    return {
      user_id: prismaUser.user_id,
      email: prismaUser.email,
      username: prismaUser.username,
      password: prismaUser.password,
      role_id: prismaUser.role_id,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
    };
  }
}
