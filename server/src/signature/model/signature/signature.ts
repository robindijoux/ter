import { ApiProperty } from '@nestjs/swagger';

export class Signature {
  @ApiProperty({
    type: String,
    required: false,
  })
  signature: string | undefined;

  constructor() {
    this.signature = undefined;
  }
}
