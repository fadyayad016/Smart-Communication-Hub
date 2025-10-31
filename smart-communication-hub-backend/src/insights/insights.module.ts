import { Module } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { AiMockService } from './ai-mock.service';

@Module({
    imports: [MessagesModule],
  controllers: [InsightsController],
  providers: [InsightsService, AiMockService],
  exports: [InsightsService],
})
export class InsightsModule {}
