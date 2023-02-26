import { ApiProperty } from '@nestjs/swagger';

export class SignatureBatchRequest {
  @ApiProperty({
    example: 'sheet#9',
  })
  sheetId: string;
  @ApiProperty({
    type: 'object',
    description: 'Map of signatures, by person id',
    example: {
      dr80: "dr80's signature",
      gt80: "gt80's signature",
    },
  })
  signatures: { [k: string]: string };
}
