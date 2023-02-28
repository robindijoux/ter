import { ApiProperty } from '@nestjs/swagger';

export class EndAttendanceRequestDto {
  @ApiProperty({
    description: 'The teacher signature',
    type: 'string',
    example: 'Teacher Signature',
  })
  teacherSignature: string;
  @ApiProperty({
    description: 'The students presence values',
    type: Object,
    example: {
      gt: true,
      dr80: false,
    },
  })
  studentsAttendance: { [key: string]: boolean };
}
