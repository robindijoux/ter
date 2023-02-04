import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from '../course/course.module';
import { SignatureModule } from '../signature/signature.module';
import { SheetService } from './sheet.service';

describe('SheetService', () => {
  let service: SheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SheetService],
      imports: [CourseModule, SignatureModule],
    }).compile();

    service = module.get<SheetService>(SheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
