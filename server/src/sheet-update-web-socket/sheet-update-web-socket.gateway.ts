import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Signature } from '../signature/model/signature/signature';

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

  publishSheetUpdate(
    sheetId: string,
    addedSignatureByStudentId: Map<string, string>,
  ) {
    if (!this.server) {
      console.log('No server yet, retrying in 2s');
      setTimeout(
        () => this.publishSheetUpdate(sheetId, addedSignatureByStudentId),
        2000,
      );
    } else {
      console.log(
        'Publishing sheet update:',
        Object.fromEntries(addedSignatureByStudentId),
      );
      this.server.emit(sheetId, Object.fromEntries(addedSignatureByStudentId));
    }
  }
}
