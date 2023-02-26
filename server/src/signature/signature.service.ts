import { Injectable } from '@nestjs/common';
import { Course } from '../course/entities/course.entity';
import { SignatureRequest } from './model/signature-request/signature-request';
import { Signature } from './model/signature/signature';
import { randomBytes } from 'crypto';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureBatchRequest } from './model/signature-batch-request/signature-batch-request';
import { SignatureBatchRequestResponse } from './model/signature-batch-request-response/signature-batch-request-response';

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

  constructor(private sheetUpdateWS: SheetUpdateWebSocketGateway) {}

  checkSignatureBatchRequest(signatureBatch: SignatureBatchRequest) {
    let res = new SignatureBatchRequestResponse();
    let remainingSignatures = new Map<string, Signature>(
      this.signaturesBySheetAndPerson.get(signatureBatch.sheetId),
    );
    for (let [personId, signature] of Object.entries(
      signatureBatch.signatures,
    )) {
      remainingSignatures.delete(personId);
      if (
        this.checkSignatureRequest({
          sheetId: signatureBatch.sheetId,
          personId,
          signature,
        })
      ) {
        res.sucess.push(personId);
      } else {
        res.failure.push(personId);
      }
    }
    for (let [personId, signature] of remainingSignatures) {
      res.missing.push(personId);
    }
    return res;
  }

  checkSignatureRequest(signature: SignatureRequest) {
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

  checkSignatureRequestAndSendUpdateMessage(signature: SignatureRequest) {
    let res = this.checkSignatureRequest(signature);
    if (!res) {
      return false;
    }
    this.sheetUpdateWS.publishSheetUpdate(
      signature.sheetId,
      new Map([[signature.personId, signature.signature]]),
    );
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
