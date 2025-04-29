import { Inject, Injectable } from '@nestjs/common';
import { IChatMessageRepository } from '../../domain/repositories.interface/chat-message.repository.interface';
import { ChatMessage } from '../../domain/entities/chat-message.entity';

@Injectable()
export class FindChatMessageByIdUseCase {
  constructor(
    @Inject('IChatMessageRepository')
    private readonly chatMessageRepository: IChatMessageRepository,
  ) {}

  async execute(id: number): Promise<ChatMessage | null> {
    return this.chatMessageRepository.findById(id);
  }
} 