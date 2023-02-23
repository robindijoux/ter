import { ApiProperty } from '@nestjs/swagger';

export class EndAttendanceRequestDto {
  @ApiProperty({
    description: 'The students signatures',
    example: {
      '1': 'present',
      '2': 'present',
    },
  })
  studentsSignatures: { [k: string]: string };
  @ApiProperty()
  teacherSignature: string;
}
