import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Course } from '../course/entities/course.entity';
import { SheetService } from '../sheet/sheet.service';
import { SignatureRequest } from './model/signature-request/signature-request';
import { Signature } from './model/signature/signature';

@Injectable()
export class SignatureService {
  // /**
  //  * Map of challenges for each person. The key is the person id.
  //  */
  // challenges: Map<string, string> = new Map();

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

  generateSignatureChallenges(
    course: Course,
    studentList: string[],
    teacherId: string,
  ) {
    const studentsSignatures = new Map<string, Signature>(
      studentList.map((s) => {
        // this.challenges.set(s, 'challenge');
        return [s, new Signature()];
      }),
    );

    const teacherSignature = new Signature();
    // this.challenges.set(teacherId, 'challenge');

    return { studentsSignatures, teacherSignature };
  }
}
