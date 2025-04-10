import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ChatMessageRepository } from '../repositories/chat-message.repository';

@Module({
  imports: [PrismaModule],
  controllers: [], // Add ChatMessageController when created
  providers: [
    PrismaService,
    {
      provide: 'IChatMessageRepository',
      useClass: ChatMessageRepository, // Create this repository
    },
    // Add use cases when created
  ],
  exports: ['IChatMessageRepository'],
})
export class ChatMessageModule {}
