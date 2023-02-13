import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  isTeacher: boolean;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    isTeacher: boolean,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isTeacher = isTeacher;
  }
}
