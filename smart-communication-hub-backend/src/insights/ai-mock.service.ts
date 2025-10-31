import { Injectable } from '@nestjs/common';

@Injectable()
export class AiMockService {
  private mockSummaries = [
    'The conversation focused on project deadlines and resource allocation.',
    'A positive exchange regarding customer feedback and next steps.',
    'A long thread discussing an unresolved technical issue.',
    'General chitchat with a negative undertone about recent company changes.',
    'A quick, decisive communication about task completion.',
  ];

  private getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  analyze(conversationText: string): { summary: string; sentiment: string } {
    let sentiment: string;
    let summary: string;

    if (conversationText.toLowerCase().includes('problem') || conversationText.toLowerCase().includes('error')) {
      sentiment = 'Negative';
      summary = 'High-priority discussion regarding a technical failure or persistent problem.';
    } else if (conversationText.toLowerCase().includes('success') || conversationText.toLowerCase().includes('great')) {
      sentiment = 'Positive';
      summary = 'A summary of positive progress and achievement confirmation.';
    } else {
      sentiment = this.getRandomElement(['Neutral', 'Slightly Positive', 'Slightly Negative']);
      summary = this.getRandomElement(this.mockSummaries);
    }

    return { summary, sentiment };
  }
}