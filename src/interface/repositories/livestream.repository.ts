import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ILivestreamRepository } from '../../core/domain/repositories.interface/livestream.repository.interface';
import { LiveStream } from '../../core/domain/entities/livestream.entity';
import { CreateLivestreamDto } from '../../core/domain/dtos/livestream/create-livestream.dto';
import { UpdateLivestreamDto } from '../../core/domain/dtos/livestream/update-livestream.dto';

@Injectable()
export class LivestreamRepository implements ILivestreamRepository {
  constructor(private prisma: PrismaService) {}

  private mapToLiveStream(data: {
    stream_id: number;
    user_id: number;
    title: string;
    description: string;
    stream_url: string;
    start_time: Date;
    end_time: Date;
    status: string;
  }): LiveStream {
    return {
      ...data,
      status: data.status as 'scheduled' | 'live' | 'ended',
    };
  }

  async create(data: CreateLivestreamDto): Promise<LiveStream> {
    const result = await this.prisma.liveStream.create({
      data,
    });
    return this.mapToLiveStream(result);
  }

  async findById(stream_id: number): Promise<LiveStream | null> {
    const result = await this.prisma.liveStream.findUnique({
      where: { stream_id },
    });
    return result ? this.mapToLiveStream(result) : null;
  }

  async findByUserId(user_id: number): Promise<LiveStream[]> {
    const results = await this.prisma.liveStream.findMany({
      where: { user_id },
    });
    return results.map((result) => this.mapToLiveStream(result));
  }

  async findActiveByUserId(user_id: number): Promise<LiveStream | null> {
    const result = await this.prisma.liveStream.findFirst({
      where: {
        user_id,
        status: 'live',
      },
    });
    return result ? this.mapToLiveStream(result) : null;
  }

  async findByStatus(
    status: 'scheduled' | 'live' | 'ended',
  ): Promise<LiveStream[]> {
    const results = await this.prisma.liveStream.findMany({
      where: { status },
    });
    return results.map((result) => this.mapToLiveStream(result));
  }

  async findUpcoming(): Promise<LiveStream[]> {
    const results = await this.prisma.liveStream.findMany({
      where: { status: 'scheduled' },
    });
    return results.map((result) => this.mapToLiveStream(result));
  }

  async findLive(): Promise<LiveStream[]> {
    const results = await this.prisma.liveStream.findMany({
      where: { status: 'live' },
    });
    return results.map((result) => this.mapToLiveStream(result));
  }

  async findEnded(): Promise<LiveStream[]> {
    const results = await this.prisma.liveStream.findMany({
      where: { status: 'ended' },
    });
    return results.map((result) => this.mapToLiveStream(result));
  }

  async update(
    stream_id: number,
    data: UpdateLivestreamDto,
  ): Promise<LiveStream> {
    const result = await this.prisma.liveStream.update({
      where: { stream_id },
      data,
    });
    return this.mapToLiveStream(result);
  }

  async updateStatus(
    stream_id: number,
    status: 'scheduled' | 'live' | 'ended',
  ): Promise<LiveStream> {
    const result = await this.prisma.liveStream.update({
      where: { stream_id },
      data: { status },
    });
    return this.mapToLiveStream(result);
  }

  async delete(stream_id: number): Promise<void> {
    await this.prisma.liveStream.delete({
      where: { stream_id },
    });
  }

  async deleteAllByUserId(user_id: number): Promise<void> {
    await this.prisma.liveStream.deleteMany({
      where: { user_id },
    });
  }
}
