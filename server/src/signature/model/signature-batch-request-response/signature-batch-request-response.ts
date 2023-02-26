import { ApiProperty } from '@nestjs/swagger';

export class SignatureBatchRequestResponse {
  @ApiProperty({
    type: 'array',
    description: "List of id's that suceeded",
    example: ['dr80'],
  })
  sucess: string[];
  @ApiProperty({
    type: 'array',
    description: "List of id's that didn't suceed",
    example: ['gt80'],
  })
  failure: string[];
  @ApiProperty({
    type: 'array',
    description:
      "List of id's that weren't in the request but that previously asked to sign the sheet",
    example: ['bs80'],
  })
  missing: string[];
}
