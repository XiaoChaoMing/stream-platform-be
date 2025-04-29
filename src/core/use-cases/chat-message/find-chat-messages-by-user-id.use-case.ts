import { Inject, Injectable } from '@nestjs/common';
import { IChatMessageRepository } from '../../domain/repositories.interface/chat-message.repository.interface';
import { ChatMessage } from '../../domain/entities/chat-message.entity';

@Injectable()
export class FindChatMessagesByUserIdUseCase {
  constructor(
    @Inject('IChatMessageRepository')
    private readonly chatMessageRepository: IChatMessageRepository,
  ) {}

  async execute(userId: number): Promise<ChatMessage[]> {
    return this.chatMessageRepository.findByUserId(userId);
  }
} 