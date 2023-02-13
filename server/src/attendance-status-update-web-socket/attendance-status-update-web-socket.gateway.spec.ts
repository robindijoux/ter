import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceStatusUpdateWebSocketGateway } from './attendance-status-update-web-socket.gateway';

describe('AttendanceStatusUpdateWebSocketGateway', () => {
  let gateway: AttendanceStatusUpdateWebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceStatusUpdateWebSocketGateway],
    }).compile();

    gateway = module.get<AttendanceStatusUpdateWebSocketGateway>(AttendanceStatusUpdateWebSocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
