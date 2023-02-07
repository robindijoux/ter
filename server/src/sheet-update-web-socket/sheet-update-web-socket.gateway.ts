import {
  OnGatewayConnection,
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
  public server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(
      'New Socket connection: ' +
        JSON.stringify(client) +
        ' (' +
        JSON.stringify(args) +
        ')',
    );
  }

  publishSheetUpdate(sheetId: string, newSheet: SheetDto) {
    this.server.emit(sheetId, newSheet);
  }
}
