import { Inject, Injectable } from '@nestjs/common';
import { IChatMessageRepository } from '../../domain/repositories.interface/chat-message.repository.interface';

@Injectable()
export class DeleteAllChatMessagesByStreamIdUseCase {
  constructor(
    @Inject('IChatMessageRepository')
    private readonly chatMessageRepository: IChatMessageRepository,
  ) {}

  async execute(streamId: number): Promise<void> {
    await this.chatMessageRepository.deleteAllByStreamId(streamId);
  }
} 