import { Injectable } from '@nestjs/common';
import { Course } from '../course/entities/course.entity';
import { SignatureRequest } from './model/signature-request/signature-request';
import { Signature } from './model/signature/signature';
import { randomBytes } from 'crypto';

@Injectable()
export class SignatureService {
  private CHALLENGE_LENGTH_IN_BYTES = 16;

  /**
   * Map of challenges, by course and person. The first map key is the sheet id and the second map key is the person id.
   */
  private signaturesBySheetAndPerson: Map<string, Map<string, Signature>> =
    new Map();

  /**
   * Public keys of each person. The map key is the person id.
   */
  private publicKeyByPerson: Map<string, string> = new Map();

  isValidSignatureRequest(signature: SignatureRequest) {
    let foundSheet = this.signaturesBySheetAndPerson.get(signature.sheetId);
    if (!foundSheet) {
      return false;
    }
    let foundSignatureObject = foundSheet.get(signature.personId);
    // TODO here will be the cryptographic check, using the public key of the person and the challenge
    if (!foundSignatureObject) {
      return false;
    }
    foundSignatureObject.signature = signature.signature;
    console.log('signature validated', this.signaturesBySheetAndPerson);
    return true;
  }

  generateSignatureChallenges(
    sheetId: string,
    studentList: string[],
    teacherId: string,
  ) {
    const studentsSignatures = new Map<string, Signature>(
      studentList.map((s) => {
        let signatureObj = new Signature(this.generateChallenge());
        return [s, signatureObj];
      }),
    );

    const teacherSignature = new Signature(this.generateChallenge());

    this.signaturesBySheetAndPerson.set(
      sheetId,
      new Map([
        ...Array.from(studentsSignatures.entries()),
        [teacherId, teacherSignature],
      ]),
    );

    console.log('new challenges generated', this.signaturesBySheetAndPerson);

    return { studentsSignatures, teacherSignature };
  }

  /**
   *
   * @returns a random string of hex characters
   */
  private generateChallenge() {
    return randomBytes(this.CHALLENGE_LENGTH_IN_BYTES).toString('hex');
  }
}
