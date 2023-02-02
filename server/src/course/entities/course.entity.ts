import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty()
  id: String;
  @ApiProperty()
  label: String;
  @ApiProperty()
  teacherId: String;
  @ApiProperty()
  studentList: String[];
  @ApiProperty()
  startDate: number;
  @ApiProperty()
  endDate: number;
}
