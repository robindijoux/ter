import { Injectable } from '@nestjs/common';
import { Course } from '../course/entities/course.entity';
import { SignatureRequest } from './model/signature-request/signature-request';
import { Signature } from './model/signature/signature';
import { randomBytes } from 'crypto';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureBatchRequest } from './model/signature-batch-request/signature-batch-request';
import { SignatureBatchRequestResponse } from './model/signature-batch-request-response/signature-batch-request-response';

export enum SIGNATURE_RESPONSE_TYPE {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  SHEET_NOT_FOUND = 'SHEET_NOT_FOUND',
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',
}

@Injectable()
export class SignatureService {
  private CHALLENGE_LENGTH_IN_BYTES = 16;

  /**
   * Map of challenges, by course and person. The first map key is the sheet id and the second map key is the person id.
   */
  private signaturesBySheetAndStudent: Map<string, Map<string, Signature>> =
    new Map();

  /**
   * Map of challenges, by course and person. The first map key is the sheet id and the second map key is the person id.
   */
  private teacherSignaturesBySheet: Map<string, Signature> = new Map();

  /**
   * Public keys of each person. The map key is the person id.
   */
  private publicKeyByPerson: Map<string, string> = new Map();

  constructor(private sheetUpdateWS: SheetUpdateWebSocketGateway) {}

  checkSignatureBatchRequest(signatureBatch: SignatureBatchRequest) {
    let res = new SignatureBatchRequestResponse();

    if (!this.signaturesBySheetAndStudent.has(signatureBatch.sheetId)) {
      return SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND;
    }

    let remainingIdOnServer = Array.from(
      this.signaturesBySheetAndStudent.get(signatureBatch.sheetId)!.entries(),
    )
      .filter(([personId, signature]) => signature.signature !== undefined)
      .map(([personId, signature]) => personId);

    for (let [personId, signature] of Object.entries(
      signatureBatch.signatures,
    )) {
      let validationRes = this.checkSignatureRequest({
        sheetId: signatureBatch.sheetId,
        personId,
        signature,
      });
      // if the signature is on NFC but not on remote, conflict
      if (validationRes === SIGNATURE_RESPONSE_TYPE.STUDENT_NOT_FOUND) {
        res.conflict.push(personId);
        break;
      }
      // remove from the remaining signatures
      console.log('remove ', personId, 'from remaining', remainingIdOnServer);
      remainingIdOnServer = remainingIdOnServer.filter((s) => s !== personId);

      switch (validationRes) {
        case SIGNATURE_RESPONSE_TYPE.SUCCESS:
          res.success.push(personId);
          break;
        case SIGNATURE_RESPONSE_TYPE.FAILURE:
          res.failure.push(personId);
          break;
        case SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND:
          res.failure.push(personId);
          break;
        default:
          return SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND;
      }
    }
    for (let id of remainingIdOnServer) {
      console.log('remaining id', id);
      res.conflict.push(id);
    }
    return res;
  }

  private findStudentSignatureObject(signature: SignatureRequest) {
    let foundSignature = this.signaturesBySheetAndStudent
      .get(signature.sheetId)!
      .get(signature.personId);
    return foundSignature
      ? foundSignature
      : SIGNATURE_RESPONSE_TYPE.STUDENT_NOT_FOUND;
  }

  private findTeacherSignatureObject(signature: SignatureRequest) {
    let foundSignature = this.teacherSignaturesBySheet.get(signature.sheetId);
    return foundSignature!;
  }

  checkSignatureRequest(signature: SignatureRequest) {
    let studentSignatureObject = this.findStudentSignatureObject(signature);
    // check if the sheet exists
    let foundSheet =
      this.signaturesBySheetAndStudent.has(signature.sheetId) ||
      this.teacherSignaturesBySheet.has(signature.sheetId);
    if (!foundSheet) {
      return SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND;
    }

    // check if ther is a corresponding student or teacher signature
    let foundSignatureObject = this.signaturesBySheetAndStudent.has(
      signature.sheetId,
    )
      ? this.findStudentSignatureObject(signature)
      : this.findTeacherSignatureObject(signature);
    if (foundSignatureObject === SIGNATURE_RESPONSE_TYPE.STUDENT_NOT_FOUND) {
      return SIGNATURE_RESPONSE_TYPE.STUDENT_NOT_FOUND;
    }

    // let publicKey = this.publicKeyByPerson.get(signature.personId);
    let publicKey = 'key'; // TODO: get public key from database
    if (!publicKey) {
      return SIGNATURE_RESPONSE_TYPE.STUDENT_NOT_FOUND;
    }
    if (
      !this.verifyCryptoSignature(
        signature.signature,
        foundSignatureObject.challenge,
        publicKey,
      )
    ) {
      return SIGNATURE_RESPONSE_TYPE.FAILURE;
    }
    foundSignatureObject.signature = signature.signature;
    console.log('signature validated', this.signaturesBySheetAndStudent);
    return SIGNATURE_RESPONSE_TYPE.SUCCESS;
  }

  checkSignatureRequestAndSendUpdateMessage(signature: SignatureRequest) {
    let res = this.checkSignatureRequest(signature);
    if (res === SIGNATURE_RESPONSE_TYPE.SUCCESS) {
      this.sheetUpdateWS.publishSheetUpdate(
        signature.sheetId,
        new Map([[signature.personId, signature.signature]]),
      );
    }
    return res;
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

    this.signaturesBySheetAndStudent.set(
      sheetId,
      new Map([
        ...Array.from(studentsSignatures.entries()),
        [teacherId, teacherSignature],
      ]),
    );

    console.log('new challenges generated', this.signaturesBySheetAndStudent);

    return { studentsSignatures, teacherSignature };
  }

  /**
   *
   * @returns a random string of hex characters
   */
  private generateChallenge() {
    return randomBytes(this.CHALLENGE_LENGTH_IN_BYTES).toString('hex');
  }

  private verifyCryptoSignature(
    signature: string,
    challenge: string,
    publicKey: string,
  ) {
    // TODO
    return true;
  }
}
