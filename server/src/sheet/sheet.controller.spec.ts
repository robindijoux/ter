import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from '../course/course.module';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureModule } from '../signature/signature.module';
import { SheetController } from './sheet.controller';
import { SheetService } from './sheet.service';

describe('SheetController', () => {
  let controller: SheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SheetController],
      providers: [SheetService, SheetUpdateWebSocketGateway],
      imports: [SignatureModule, CourseModule],
    }).compile();

    controller = module.get<SheetController>(SheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
