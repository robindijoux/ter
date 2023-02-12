import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SheetDto } from '../sheet/dto/sheet.dto';

@WebSocketGateway({
  namespace: 'sheetUpdate',
  cors: {
    origin: '*',
  },
})
export class SheetUpdateWebSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    // console.log('New Socket connection', client, args);
  }

  publishSheetUpdate(sheetId: string, newSheet: SheetDto) {
    if (!this.server) {
      console.log('No server yet, retrying in 2s');
      setTimeout(() => this.publishSheetUpdate(sheetId, newSheet), 2000);
    } else {
      // console.log('Publishing sheet update:', newSheet);
      this.server.emit(sheetId, newSheet);
    }
  }
}
