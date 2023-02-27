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
  PERSON_NOT_FOUND = 'PERSON_NOT_FOUND',
}

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
    let remainingSignaturesOnServer = new Map<string, Signature>(
      this.signaturesBySheetAndPerson.get(signatureBatch.sheetId),
    );
    let remainingSignaturesOnNfc = new Map<string, Signature>(
      this.signaturesBySheetAndPerson.get(signatureBatch.sheetId),
    );
    for (let [personId, signature] of Object.entries(
      signatureBatch.signatures,
    )) {
      remainingSignaturesOnServer.delete(personId);
      switch (
        this.checkSignatureRequest({
          sheetId: signatureBatch.sheetId,
          personId,
          signature,
        })
      ) {
        case SIGNATURE_RESPONSE_TYPE.SUCCESS:
          res.sucess.push(personId);
          break;
        case SIGNATURE_RESPONSE_TYPE.FAILURE:
          res.failure.push(personId);
          break;
        case SIGNATURE_RESPONSE_TYPE.PERSON_NOT_FOUND:
          res.conflict.push(personId);
          break;
        case SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND:
          return SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND;
        default:
          return SIGNATURE_RESPONSE_TYPE.FAILURE;
          break;
      }
    }
    for (let [personId, signature] of remainingSignaturesOnServer) {
      res.conflict.push(personId);
    }
    return res;
  }

  checkSignatureRequest(signature: SignatureRequest) {
    let foundSheet = this.signaturesBySheetAndPerson.get(signature.sheetId);
    if (!foundSheet) {
      return SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND;
    }
    let foundSignatureObject = foundSheet.get(signature.personId);
    if (!foundSignatureObject) {
      return SIGNATURE_RESPONSE_TYPE.PERSON_NOT_FOUND;
    }
    let publicKey = this.publicKeyByPerson.get(signature.personId);
    if (!publicKey) {
      return SIGNATURE_RESPONSE_TYPE.PERSON_NOT_FOUND;
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
    console.log('signature validated', this.signaturesBySheetAndPerson);
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

  private verifyCryptoSignature(
    signature: string,
    challenge: string,
    publicKey: string,
  ) {
    // TODO
    return true;
  }
}
