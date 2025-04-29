import { Inject, Injectable } from '@nestjs/common';
import { IChatMessageRepository } from '../../domain/repositories.interface/chat-message.repository.interface';

@Injectable()
export class DeleteAllChatMessagesByUserIdUseCase {
  constructor(
    @Inject('IChatMessageRepository')
    private readonly chatMessageRepository: IChatMessageRepository,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.chatMessageRepository.deleteAllByUserId(userId);
  }
} 