import { Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { CourseService } from 'src/course/course.service';

@Module({
  controllers: [SheetController],
  providers: [SheetService, CourseService],
})
export class SheetModule {}
