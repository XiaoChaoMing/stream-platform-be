import { Module } from '@nestjs/common';
import { WebSocketModule } from './websocket.module';
import { ChatMessageGateway } from '../gateways/chat-message.gateway';
import { ChatMessageRepository } from '../repositories/chat-message.repository';
import {
  CreateChatMessageUseCase,
  FindChatMessageByIdUseCase,
  FindChatMessagesByStreamIdUseCase,
  FindChatMessagesByUserIdUseCase,
  FindChatMessagesByStreamAndUserUseCase,
  DeleteChatMessageUseCase,
  DeleteAllChatMessagesByStreamIdUseCase,
  DeleteAllChatMessagesByUserIdUseCase,
} from '../../core/use-cases/chat-message';

@Module({
  imports: [WebSocketModule],
  providers: [
    {
      provide: 'IChatMessageRepository',
      useClass: ChatMessageRepository,
    },
    CreateChatMessageUseCase,
    FindChatMessageByIdUseCase,
    FindChatMessagesByStreamIdUseCase,
    FindChatMessagesByUserIdUseCase,
    FindChatMessagesByStreamAndUserUseCase,
    DeleteChatMessageUseCase,
    DeleteAllChatMessagesByStreamIdUseCase,
    DeleteAllChatMessagesByUserIdUseCase,
    ChatMessageGateway,
  ],
  exports: ['IChatMessageRepository', ChatMessageGateway],
})
export class ChatMessageModule {}
