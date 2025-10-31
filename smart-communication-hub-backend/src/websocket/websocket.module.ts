import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { MessagesModule } from 'src/messages/messages.module';
import { MessagesService } from 'src/messages/messages.service';
import { UsersModule } from 'src/users/users.module';
@Module({

    imports: [UsersModule],
    providers: [WebsocketGateway, MessagesService],
    exports: [WebsocketGateway],
})
export class WebsocketModule {}
