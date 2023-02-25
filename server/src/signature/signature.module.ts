import { forwardRef, Module } from '@nestjs/common';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';

@Module({
  imports: [],
  controllers: [SignatureController],
  providers: [SignatureService, SheetUpdateWebSocketGateway],
  exports: [SignatureService],
})
export class SignatureModule {}
