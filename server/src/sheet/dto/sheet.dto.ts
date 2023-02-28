import { ApiProperty } from '@nestjs/swagger';
import { Signature } from '../../signature/model/signature/signature';
import { AttendanceStatus, Sheet } from '../entities/sheet.entity';

export class SheetDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  courseLabel: string;
  @ApiProperty()
  courseStartDate: number;
  @ApiProperty()
  courseEndDate: number;
  @ApiProperty()
  teacherId: string;
  @ApiProperty()
  signatures: { [k: string]: Signature };
  @ApiProperty()
  teacherSignature: Signature;
  @ApiProperty({ enum: ['OPEN', 'CLOSED', 'INTERRUPTED'] })
  attendanceStatus: AttendanceStatus;
  @ApiProperty({ type: Object, example: { gt: true, dr80: false } })
  studentsAttendance: { [key: string]: boolean };

  constructor(sheet: Sheet) {
    this.id = sheet.id;
    this.courseLabel = sheet.courseLabel;
    this.courseStartDate = sheet.courseStartDate;
    this.courseEndDate = sheet.courseEndDate;
    this.teacherId = sheet.teacherId;
    this.signatures = Object.fromEntries(sheet.studentsSignatures);
    this.teacherSignature = sheet.teacherSignature;
    this.attendanceStatus = sheet.attendanceStatus;
    this.studentsAttendance = Object.fromEntries(sheet.studentsAttendance);
  }
}
