import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignatureBatchRequestResponse } from './model/signature-batch-request-response/signature-batch-request-response';
import { SignatureBatchRequest } from './model/signature-batch-request/signature-batch-request';
import { SignatureRequest } from './model/signature-request/signature-request';
import { SignatureService, SIGNATURE_RESPONSE_TYPE } from './signature.service';

@Controller('signature')
@ApiTags('Signature')
export class SignatureController {
  constructor(private signatureService: SignatureService) {}

  @Post()
  @ApiCreatedResponse({
    type: String,
    description: 'The signature has been validated.',
  })
  @ApiUnauthorizedResponse({
    type: String,
    description: "The signature hasn't been validated.",
  })
  @ApiNotFoundResponse({
    type: String,
    description: 'The person or the sheet has not been found.',
  })
  @ApiOperation({
    summary: 'Validate a signature.',
  })
  sign(@Body() signatureRequest: SignatureRequest) {
    // console.log('signature request', JSON.stringify(signatureRequest));
    let res = this.signatureService.checkSignatureRequest(signatureRequest);
    switch (res) {
      case SIGNATURE_RESPONSE_TYPE.SUCCESS:
        return 'Signature validated';
      case SIGNATURE_RESPONSE_TYPE.FAILURE:
        throw new HttpException(
          'Signature not validated',
          HttpStatus.UNAUTHORIZED,
        );
      case SIGNATURE_RESPONSE_TYPE.PERSON_NOT_FOUND:
        throw new HttpException('Person not found', HttpStatus.NOT_FOUND);
      case SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND:
        throw new HttpException('Sheet not found', HttpStatus.NOT_FOUND);
      default:
        throw new HttpException(
          'Signature not validated',
          HttpStatus.UNAUTHORIZED,
        );
    }
  }

  @Post('batch')
  @ApiOperation({
    summary: 'Validate a batch of signatures.',
    description:
      "Send a batch of signatures to validate. Returns a list of id's that suceeded, those who didn't and those who were in conflict.",
  })
  @ApiCreatedResponse({
    type: SignatureBatchRequestResponse,
    description:
      "A list of id's that suceeded, those who didn't and those who were in conflict. The conflicts are the ids thats weren't in the request but that previously asked server to sign the sheet, or those who were in the request but that didn't previously asked server to sign the sheet.",
  })
  @ApiNotFoundResponse({
    type: String,
    description: 'The sheet has not been found.',
  })
  batchSign(@Body() signatureRequests: SignatureBatchRequest) {
    // console.log('signature request', JSON.stringify(signatureRequest));
    let res =
      this.signatureService.checkSignatureBatchRequest(signatureRequests);

    if (res === SIGNATURE_RESPONSE_TYPE.SHEET_NOT_FOUND) {
      throw new HttpException('Sheet not found', HttpStatus.NOT_FOUND);
    }

    return res;
  }
}
