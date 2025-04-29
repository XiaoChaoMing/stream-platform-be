import { Inject, Injectable } from '@nestjs/common';
import { IChatMessageRepository } from '../../domain/repositories.interface/chat-message.repository.interface';

@Injectable()
export class DeleteChatMessageUseCase {
  constructor(
    @Inject('IChatMessageRepository')
    private readonly chatMessageRepository: IChatMessageRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.chatMessageRepository.delete(id);
  }
} 