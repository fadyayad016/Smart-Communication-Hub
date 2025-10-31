import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesService } from 'src/messages/messages.service';
import { AiMockService } from './ai-mock.service';
import { Insight } from '@prisma/client';

@Injectable()
export class InsightsService {
  constructor(
    private prisma: PrismaService,
    private messagesService: MessagesService,
    private aiMockService: AiMockService,
  ) {}

  async generateAndSaveInsight(currentUserId: number, targetUserId: number): Promise<Insight|null> {
    const conversation = await this.messagesService.findConversation(currentUserId, targetUserId);

    if (conversation.length === 0) {
      return null;
    }

    const conversationKey = conversation[0].conversationKey;
    const conversationText = conversation.map(m => `${m.sender.name}: ${m.text}`).join('\n');

    const aiResult = this.aiMockService.analyze(conversationText);

    return this.prisma.insight.upsert({
      where: { conversationKey },
      update: {
        summary: aiResult.summary,
        sentiment: aiResult.sentiment,
      },
      create: {
        conversationKey,
        summary: aiResult.summary,
        sentiment: aiResult.sentiment,
        messageId: conversation[conversation.length - 1].id, 
      },
    });
  }

  async getInsightByConversation(currentUserId: number, targetUserId: number): Promise<Insight | null> {
    const sortedIds = [currentUserId, targetUserId].sort((a, b) => a - b);
    const conversationKey = `conv_${sortedIds[0]}_${sortedIds[1]}`;

    return this.prisma.insight.findUnique({
      where: { conversationKey },
    });
  }
}