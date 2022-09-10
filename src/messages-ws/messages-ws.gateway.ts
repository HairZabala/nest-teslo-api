import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const jwtToken = client.handshake.headers.authorization as string;

    try {
      const payload = this.jwtService.verify(jwtToken);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleEvent(
    @MessageBody() data: { id: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // socket.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: data.message,
    // });

    // socket.broadcast.emit('message-from-server', {
    //   fullName: this.messagesWsService.getUserFullName(socket.id),
    //   message: data.message,
    // });

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(socket.id),
      message: data.message,
    });
  }
}
