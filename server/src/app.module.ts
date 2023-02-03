import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { SheetModule } from './sheet/sheet.module';

@Module({
  imports: [CourseModule, SheetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
