import { ApiProperty } from '@nestjs/swagger';

export class SignatureRequest {
  @ApiProperty()
  personId: string;
  @ApiProperty()
  sheetId: string;
  @ApiProperty()
  signature: string;

  constructor(personId: string, sheetId: string, signature: string) {
    this.personId = personId;
    this.sheetId = sheetId;
    this.signature = signature;
  }
}
