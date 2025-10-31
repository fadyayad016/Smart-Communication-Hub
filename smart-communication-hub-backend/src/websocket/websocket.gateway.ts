// This gateway handles connection events, online status, and real-time message forwarding.

import {WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';

// Store userId -> socketId mapping for direct messaging
const userSocketMap = new Map<number, string>();


@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001', 
    credentials: true,
  },
})


export class WebsocketGateway{
  @WebSocketServer()
  server: Server;


  private readonly logger = new Logger(WebsocketGateway.name);
  constructor(private messagesService: MessagesService,
    private usersService: UsersService
  ) {}


  
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }


  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === client.id) {
        userSocketMap.delete(userId);
        this.server.emit('user_offline', userId);
        break;
      }
    }
  }

  @SubscribeMessage('register_socket')
  handleRegisterSocket(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    userSocketMap.set(userId, client.id);
    this.server.emit('user_online', userId); 
    this.logger.log(`User ${userId} registered with socket ${client.id}`);
  }


  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: { senderId: number, message: CreateMessageDto }) {
    
    // 1. Save the message to the database
    const savedMessage = await this.messagesService.create(data.senderId, data.message);

    // 2. Fetch the ENRICHED message object (including sender/receiver details)
    const enrichedMessage = await this.messagesService.findMessageById(savedMessage.id);
    
    if (!enrichedMessage) return; // Safety check

    // 3. Emit message to sender using the ENRICHED object
    const senderSocketId = userSocketMap.get(data.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('new_message', enrichedMessage); 
    }
    
    // 4. Emit message to receiver using the ENRICHED object
    const receiverSocketId = userSocketMap.get(data.message.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('new_message', enrichedMessage);
    }
  }

}