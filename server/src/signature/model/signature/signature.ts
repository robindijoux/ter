import { ApiProperty } from '@nestjs/swagger';

export class Signature {
  @ApiProperty({
    type: String,
    required: false,
  })
  signature: string | undefined;
  @ApiProperty({
    type: String,
    required: true,
  })
  challenge: string;

  constructor(challenge: string) {
    this.signature = undefined;
    this.challenge = challenge;
  }
}
