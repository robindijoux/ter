import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { SheetModule } from './sheet/sheet.module';
import { SignatureModule } from './signature/signature.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [CourseModule, SheetModule, SignatureModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
