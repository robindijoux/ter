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
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignatureBatchRequestResponse } from './model/signature-batch-request-response/signature-batch-request-response';
import { SignatureBatchRequest } from './model/signature-batch-request/signature-batch-request';
import { SignatureRequest } from './model/signature-request/signature-request';
import { SignatureService } from './signature.service';

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
  @ApiOperation({
    summary: 'Validate a signature.',
  })
  sign(@Body() signatureRequest: SignatureRequest) {
    // console.log('signature request', JSON.stringify(signatureRequest));

    if (
      this.signatureService.checkSignatureRequestAndSendUpdateMessage(
        signatureRequest,
      )
    ) {
      return 'Signature validated';
    }
    throw new HttpException('Signature not validated', HttpStatus.UNAUTHORIZED);
  }

  @Post('batch')
  @ApiOperation({
    summary: 'Validate a batch of signatures.',
    description:
      "Send a batch of signatures to validate. Returns a list of id's that suceeded, those who didn't and those who weren't in the request but that previously asked server to sign the sheet.",
  })
  @ApiCreatedResponse({
    type: SignatureBatchRequestResponse,
    description:
      "A list of id's that suceeded, those who didn't and those who weren't in the request but that previously asked server to sign the sheet.",
  })
  batchSign(@Body() signatureRequests: SignatureBatchRequest) {
    // console.log('signature request', JSON.stringify(signatureRequest));

    return this.signatureService.checkSignatureBatchRequest(signatureRequests);
  }
}
