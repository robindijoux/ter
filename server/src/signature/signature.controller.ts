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

    if (this.signatureService.isValidSignatureRequest(signatureRequest)) {
      return 'Signature validated';
    }
    throw new HttpException('Signature not validated', HttpStatus.UNAUTHORIZED);
  }
}
