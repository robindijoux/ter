import { forwardRef, Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { SignatureModule } from '../signature/signature.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [forwardRef(() => SignatureModule), CourseModule],
  controllers: [SheetController],
  providers: [SheetService],
  exports: [SheetService],
})
export class SheetModule {}
