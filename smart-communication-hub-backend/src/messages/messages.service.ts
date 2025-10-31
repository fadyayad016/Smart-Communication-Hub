import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  private getConversationKey(id1: number, id2: number): string {
    const sortedIds = [id1, id2].sort((a, b) => a - b);
    return `conv_${sortedIds[0]}_${sortedIds[1]}`;
  }

  async create(senderId: number, createMessageDto: CreateMessageDto) {
    const { receiverId, text } = createMessageDto;
    const conversationKey = this.getConversationKey(senderId, receiverId);

    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        conversationKey,
      },
    });
  }


  async findConversation(currentUserId: number, targetUserId: number) {
    const conversationKey = this.getConversationKey(currentUserId, targetUserId);

    return this.prisma.message.findMany({
      where: {
        conversationKey,
      },
      orderBy: {
        timestamp: 'asc',
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });
  }

async findMessageById(messageId: number) {
  return this.prisma.message.findUnique({
    where: { id: messageId },
    include: {
      sender: { select: { id: true, name: true } }, 
      receiver: { select: { id: true, name: true } }, 
    },
  });
}



async searchInConversation(
    currentUserId: number,
    targetUserId: number,
    query: string,
  ) {
    // 1. Get the same conversation key used for finding/creating messages
    const conversationKey = this.getConversationKey(currentUserId, targetUserId);

    // 2. Find messages that match the conversation AND contain the search query
    return this.prisma.message.findMany({
      where: {
        conversationKey: conversationKey, // Filter by conversation
        text: {
          contains: query, // Filter by search text
          mode: 'insensitive', // Make search case-insensitive
        },
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: {
        timestamp: 'asc', 
      },
    });
  }

}
