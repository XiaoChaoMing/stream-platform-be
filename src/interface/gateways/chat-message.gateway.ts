import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SocketProvider } from '../../infrastructure/websocket/socket.provider';
import {
  CreateChatMessageUseCase,
  FindChatMessagesByStreamIdUseCase,
  FindChatMessagesByUserIdUseCase,
  FindChatMessagesByStreamAndUserUseCase,
  DeleteChatMessageUseCase,
  DeleteAllChatMessagesByStreamIdUseCase,
} from '../../core/use-cases/chat-message';
import { CreateChatMessageDto } from '../../core/domain/dtos/chat-message/create-chat-message.dto';

@Injectable()
export class ChatMessageGateway implements OnModuleInit {
  private readonly logger = new Logger(ChatMessageGateway.name);

  constructor(
    private readonly socketProvider: SocketProvider,
    private readonly createChatMessageUseCase: CreateChatMessageUseCase,
    private readonly findChatMessagesByStreamIdUseCase: FindChatMessagesByStreamIdUseCase,
    private readonly findChatMessagesByUserIdUseCase: FindChatMessagesByUserIdUseCase,
    private readonly findChatMessagesByStreamAndUserUseCase: FindChatMessagesByStreamAndUserUseCase,
    private readonly deleteChatMessageUseCase: DeleteChatMessageUseCase,
    private readonly deleteAllChatMessagesByStreamIdUseCase: DeleteAllChatMessagesByStreamIdUseCase,
  ) {}

  onModuleInit() {
    this.subscribeToEvents();
    this.logger.log('ChatMessageGateway initialized and subscribed to events');
  }

  async handleSendChatMessage(data: CreateChatMessageDto): Promise<void> {
    try {
      this.logger.log(
        `Creating chat message from user ${data.user_id} to stream ${data.stream_id}`,
      );

      // Create the chat message
      const chatMessage = await this.createChatMessageUseCase.execute(data);

      // Emit to all connected clients
      this.socketProvider.emitToAll('chatMessageCreated', {
        status: 'success',
        message: chatMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Error creating chat message: ${error.message}`);
      this.socketProvider.emitToAll('chatMessageCreated', {
        status: 'error',
        message: 'Failed to create chat message',
        data,
      });
    }
  }

  async handleGetStreamChatMessages(streamId: number): Promise<void> {
    try {
      const messages = await this.findChatMessagesByStreamIdUseCase.execute(
        streamId,
      );

      this.socketProvider.emitToAll('streamChatMessagesResponse', {
        status: 'success',
        streamId,
        messages,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `Error getting chat messages for stream ${streamId}: ${error.message}`,
      );
      this.socketProvider.emitToAll('streamChatMessagesResponse', {
        status: 'error',
        message: 'Failed to get chat messages',
        streamId,
      });
    }
  }

  async handleGetUserChatMessages(userId: number): Promise<void> {
    try {
      const messages = await this.findChatMessagesByUserIdUseCase.execute(
        userId,
      );

      this.socketProvider.emitToAll('userChatMessagesResponse', {
        status: 'success',
        userId,
        messages,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `Error getting chat messages for user ${userId}: ${error.message}`,
      );
      this.socketProvider.emitToAll('userChatMessagesResponse', {
        status: 'error',
        message: 'Failed to get chat messages',
        userId,
      });
    }
  }

  async handleGetStreamUserChatMessages(
    streamId: number,
    userId: number,
  ): Promise<void> {
    try {
      const messages = await this.findChatMessagesByStreamAndUserUseCase.execute(
        streamId,
        userId,
      );

      this.socketProvider.emitToAll('streamUserChatMessagesResponse', {
        status: 'success',
        streamId,
        userId,
        messages,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `Error getting chat messages for stream ${streamId} and user ${userId}: ${error.message}`,
      );
      this.socketProvider.emitToAll('streamUserChatMessagesResponse', {
        status: 'error',
        message: 'Failed to get chat messages',
        streamId,
        userId,
      });
    }
  }

  async handleDeleteChatMessage(messageId: number): Promise<void> {
    try {
      await this.deleteChatMessageUseCase.execute(messageId);

      this.socketProvider.emitToAll('chatMessageDeleted', {
        status: 'success',
        messageId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `Error deleting chat message ${messageId}: ${error.message}`,
      );
      this.socketProvider.emitToAll('chatMessageDeleted', {
        status: 'error',
        message: 'Failed to delete chat message',
        messageId,
      });
    }
  }

  async handleDeleteStreamChatMessages(streamId: number): Promise<void> {
    try {
      await this.deleteAllChatMessagesByStreamIdUseCase.execute(streamId);

      this.socketProvider.emitToAll('streamChatMessagesDeleted', {
        status: 'success',
        streamId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(
        `Error deleting chat messages for stream ${streamId}: ${error.message}`,
      );
      this.socketProvider.emitToAll('streamChatMessagesDeleted', {
        status: 'error',
        message: 'Failed to delete chat messages',
        streamId,
      });
    }
  }

  // Method to subscribe to socket events
  subscribeToEvents(): void {
    this.socketProvider.server.on('connection', (socket) => {
      // Chat message events
      socket.on('sendChatMessage', (data: CreateChatMessageDto) => {
        this.handleSendChatMessage(data);
      });

      socket.on('getStreamChatMessages', (streamId: number) => {
        this.handleGetStreamChatMessages(streamId);
      });

      socket.on('getUserChatMessages', (userId: number) => {
        this.handleGetUserChatMessages(userId);
      });

      socket.on(
        'getStreamUserChatMessages',
        ({ streamId, userId }: { streamId: number; userId: number }) => {
          this.handleGetStreamUserChatMessages(streamId, userId);
        },
      );

      socket.on('deleteChatMessage', (messageId: number) => {
        this.handleDeleteChatMessage(messageId);
      });

      socket.on('deleteStreamChatMessages', (streamId: number) => {
        this.handleDeleteStreamChatMessages(streamId);
      });
    });
  }
} 