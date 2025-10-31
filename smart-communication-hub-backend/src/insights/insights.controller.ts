import { Controller, Post, Get, Query, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { InsightsService } from './insights.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Post('generate')
  generate(
    @Request() req,
    @Query('targetUserId', ParseIntPipe) targetUserId: number,
  ) {
    const currentUserId = req.user.id;
    return this.insightsService.generateAndSaveInsight(currentUserId, targetUserId);
  }

  @Get()
  get(
    @Request() req,
    @Query('targetUserId', ParseIntPipe) targetUserId: number,
  ) {
    const currentUserId = req.user.id;
    return this.insightsService.getInsightByConversation(currentUserId, targetUserId);
  }
}