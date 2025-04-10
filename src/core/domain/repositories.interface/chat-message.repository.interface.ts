import { ChatMessage } from '../entities/chat-message.entity';
import { CreateChatMessageDto } from '../dtos/chat-message/create-chat-message.dto';

export interface IChatMessageRepository {
  create(data: CreateChatMessageDto): Promise<ChatMessage>;
  findById(id: number): Promise<ChatMessage | null>;
  findByStreamId(streamId: number): Promise<ChatMessage[]>;
  findByUserId(userId: number): Promise<ChatMessage[]>;
  findByStreamAndUser(streamId: number, userId: number): Promise<ChatMessage[]>;
  delete(id: number): Promise<void>;
  deleteAllByStreamId(streamId: number): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
