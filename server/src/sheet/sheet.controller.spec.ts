import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from '../course/course.service';
import { SheetController } from './sheet.controller';
import { SheetService } from './sheet.service';

describe('SheetController', () => {
  let controller: SheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SheetController],
      providers: [SheetService, CourseService],
    }).compile();

    controller = module.get<SheetController>(SheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
