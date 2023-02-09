import { forwardRef, Module } from '@nestjs/common';
import { SheetService } from './sheet.service';
import { SheetController } from './sheet.controller';
import { SignatureModule } from '../signature/signature.module';
import { CourseModule } from '../course/course.module';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';

@Module({
  imports: [forwardRef(() => SignatureModule), CourseModule],
  controllers: [SheetController],
  providers: [SheetService, SheetUpdateWebSocketGateway],
  exports: [SheetService],
})
export class SheetModule {}
