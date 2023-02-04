import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty()
  id: string;
  @ApiProperty()
  label: string;
  @ApiProperty()
  teacherId: string;
  @ApiProperty()
  studentList: string[];
  @ApiProperty()
  startDate: number;
  @ApiProperty()
  endDate: number;
}
