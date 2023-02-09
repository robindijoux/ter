import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationRequest {
  @ApiProperty()
  userId: string;
}
