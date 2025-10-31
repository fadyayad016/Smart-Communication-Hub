import { Controller, Post, Body, Get, Query, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetConversationDto } from './dto/get-conversation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('messages')


export class MessagesController{

    constructor(private readonly messagesService: MessagesService) {}

    @Post()
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    const senderId = req.user.id;
    return this.messagesService.create(senderId, createMessageDto);
  }

  @Get('conversation')
  findConversation(@Request() req, @Query('targetUserId', ParseIntPipe) targetUserId: number) {
    const currentUserId = req.user.id;
    return this.messagesService.findConversation(currentUserId, targetUserId);
  }



  @Get('search')
  searchConversation(
    @Request() req,
    @Query('targetUserId', ParseIntPipe) targetUserId: number,
    @Query('q') query: string,
  ) {
    const currentUserId = req.user.id;
    return this.messagesService.searchInConversation(
      currentUserId,
      targetUserId,
      query,
    );
  }


}