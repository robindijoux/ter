import { ApiProperty } from '@nestjs/swagger';

export class SignatureBatchRequestResponse {
  @ApiProperty({
    type: 'array',
    description: "List of id's that suceeded",
    example: ['dr80'],
  })
  success: string[];
  @ApiProperty({
    type: 'array',
    description: "List of id's that didn't suceed",
    example: ['gt80'],
  })
  failure: string[];
  @ApiProperty({
    type: 'array',
    description:
      "List of id's that weren't in the request but that previously asked server to sign the sheet, or those who were in the request but that didn't previously asked server to sign the sheet.",
    example: ['bs80'],
  })
  conflict: string[];

  constructor() {
    this.success = [];
    this.failure = [];
    this.conflict = [];
  }
}
