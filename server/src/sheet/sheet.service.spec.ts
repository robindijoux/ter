import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceStatusUpdateWebSocketGateway } from '../attendance-status-update-web-socket/attendance-status-update-web-socket.gateway';
import { CourseModule } from '../course/course.module';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureModule } from '../signature/signature.module';
import { SheetService } from './sheet.service';

describe('SheetService', () => {
  let service: SheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SheetService,
        SheetUpdateWebSocketGateway,
        AttendanceStatusUpdateWebSocketGateway,
      ],
      imports: [CourseModule, SignatureModule],
    }).compile();

    service = module.get<SheetService>(SheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
