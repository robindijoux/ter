import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AttendanceStatus } from '../sheet/entities/sheet.entity';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'attendanceStatusUpdate',
  cors: {
    origin: '*',
  },
})
export class AttendanceStatusUpdateWebSocketGateway {
  @WebSocketServer()
  server: Server;

  publishAttendanceStatusUpdate(
    id: string,
    attendanceStatus: AttendanceStatus,
  ) {
    this.server.emit(id, attendanceStatus);
  }
}
