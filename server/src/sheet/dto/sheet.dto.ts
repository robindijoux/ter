import { ApiProperty } from '@nestjs/swagger';
import { Signature } from '../../signature/model/signature/signature';
import { Sheet } from '../entities/sheet.entity';

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

  constructor(sheet: Sheet) {
    this.id = sheet.id;
    this.courseLabel = sheet.courseLabel;
    this.courseStartDate = sheet.courseStartDate;
    this.courseEndDate = sheet.courseEndDate;
    this.teacherId = sheet.teacherId;
    this.signatures = Object.fromEntries(sheet.studentsSignatures);
    this.teacherSignature = sheet.teacherSignature;
  }
}
