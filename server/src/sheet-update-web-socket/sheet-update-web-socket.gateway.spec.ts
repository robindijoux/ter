import { Test, TestingModule } from '@nestjs/testing';
import { SheetDto } from '../sheet/dto/sheet.dto';
import { SheetUpdateWebSocketGateway } from './sheet-update-web-socket.gateway';
import * as io from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';

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

  describe('handleConnection', () => {
    it('should log a message when a new socket connection is established', () => {
      const spy = jest.spyOn(console, 'log');
      const client = {};
      const args: any = [];

      gateway.handleConnection(client, ...args);

      expect(spy).toHaveBeenCalledWith(
        'New Socket connection: ' +
          JSON.stringify(client) +
          ' (' +
          JSON.stringify(args) +
          ')',
      );

      spy.mockRestore();
    });
  });
});
