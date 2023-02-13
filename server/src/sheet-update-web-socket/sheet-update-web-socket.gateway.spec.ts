import { Test, TestingModule } from '@nestjs/testing';
import { SheetUpdateWebSocketGateway } from './sheet-update-web-socket.gateway';

describe('SheetUpdateWebSocketGateway', () => {
  let gateway: SheetUpdateWebSocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SheetUpdateWebSocketGateway],
    }).compile();

    gateway = module.get<SheetUpdateWebSocketGateway>(
      SheetUpdateWebSocketGateway,
    );
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
