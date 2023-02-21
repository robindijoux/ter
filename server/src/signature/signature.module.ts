import { forwardRef, Module } from '@nestjs/common';
import { SheetModule } from '../sheet/sheet.module';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';

@Module({
  imports: [],
  controllers: [SignatureController],
  providers: [SignatureService],
  exports: [SignatureService],
})
export class SignatureModule {}
