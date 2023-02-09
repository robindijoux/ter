import { ApiProperty } from '@nestjs/swagger';
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
  signatures: Object;

  constructor(sheet: Sheet) {
    this.id = sheet.id;
    this.courseLabel = sheet.courseLabel;
    this.courseStartDate = sheet.courseStartDate;
    this.courseEndDate = sheet.courseEndDate;
    this.teacherId = sheet.teacherId;
    this.signatures = Object.fromEntries(sheet.studentsSignatures);
  }
}
