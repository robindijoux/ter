import { ApiProperty } from '@nestjs/swagger';

export class SignatureRequest {
  @ApiProperty()
  personId: string;
  @ApiProperty()
  sheetId: string;
  @ApiProperty()
  signature: string;
}
