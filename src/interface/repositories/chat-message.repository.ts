import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IChatMessageRepository } from '../../core/domain/repositories.interface/chat-message.repository.interface';
import { ChatMessage } from '../../core/domain/entities/chat-message.entity';
import { CreateChatMessageDto } from '../../core/domain/dtos/chat-message/create-chat-message.dto';

@Injectable()
export class ChatMessageRepository implements IChatMessageRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateChatMessageDto): Promise<ChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data,
    });
    const chatResponse = await this.prisma.chatMessage.findUnique({
      where: { message_id: chatMessage.message_id },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return chatResponse;
  }

  async findById(message_id: number): Promise<ChatMessage | null> {
    return this.prisma.chatMessage.findUnique({
      where: { message_id },
    });
  }

  async findByStreamId(stream_id: number): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { stream_id },
    });
  }

  async findByUserId(user_id: number): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { user_id },
    });
  }

  async findByStreamAndUser(
    stream_id: number,
    user_id: number,
  ): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { stream_id, user_id },
    });
  }

  async delete(message_id: number): Promise<void> {
    await this.prisma.chatMessage.delete({
      where: { message_id },
    });
  }

  async deleteAllByStreamId(stream_id: number): Promise<void> {
    await this.prisma.chatMessage.deleteMany({
      where: { stream_id },
    });
  }

  async deleteAllByUserId(user_id: number): Promise<void> {
    await this.prisma.chatMessage.deleteMany({
      where: { user_id },
    });
  }
}
