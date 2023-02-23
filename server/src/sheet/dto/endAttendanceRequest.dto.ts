import { ApiProperty } from '@nestjs/swagger';

export class EndAttendanceRequestDto {
  @ApiProperty({
    description: 'The teacher signature',
    type: 'string',
    example: 'Teacher Signature',
  })
  teacherSignature: string;
  @ApiProperty({
    description: 'The students signatures',
    type: Object,
    example: {
      gt: 'present',
      dr80: 'present',
    },
  })
  studentsSignatures: { [key: string]: string };
  @ApiProperty({
    description: "List of students id's that will be marked as present",
    type: [String],
    example: ['newStudent803216'],
  })
  whiteList: string[];
}
