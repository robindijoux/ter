import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Course } from '../course/entities/course.entity';
import { SheetService } from '../sheet/sheet.service';
import { SignatureRequest } from './model/signature-request/signature-request';
import { Signature } from './model/signature/signature';

@Injectable()
export class SignatureService {
  constructor(
    @Inject(forwardRef(() => SheetService)) private sheetService: SheetService,
  ) {}

  sign(signature: SignatureRequest) {
    return (
      this.checkSignatureRequest(signature) &&
      this.sheetService.addSignature(signature)
    );
  }

  private checkSignatureRequest(signatureRequest: SignatureRequest) {
    // TODO here will be the cryptographic check
    return true;
  }

  generateSignatureChallenges(course: Course, studentList: string[]) {
    return new Map<string, Signature>(
      studentList.map((s) => [s, new Signature()]),
    );
  }
}
