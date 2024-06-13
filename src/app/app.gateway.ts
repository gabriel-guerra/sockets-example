import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['X-API-TOKEN'],
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    private history: {message: string, clientId: string}[] = [];
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
    
    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
    console.log('msgToServer', payload);
    this.server.emit('msgToClient', payload, client.id);
    this.history.push({message: payload, clientId: client.id});
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.server.emit('buildHistory', history);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
