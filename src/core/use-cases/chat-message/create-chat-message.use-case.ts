import { Inject, Injectable } from '@nestjs/common';
import { IChatMessageRepository } from '../../domain/repositories.interface/chat-message.repository.interface';
import { CreateChatMessageDto } from '../../domain/dtos/chat-message/create-chat-message.dto';
import { ChatMessage } from '../../domain/entities/chat-message.entity';

@Injectable()
export class CreateChatMessageUseCase {
  constructor(
    @Inject('IChatMessageRepository')
    private readonly chatMessageRepository: IChatMessageRepository,
  ) {}

  async execute(data: CreateChatMessageDto): Promise<ChatMessage> {
    return this.chatMessageRepository.create(data);
  }
} 