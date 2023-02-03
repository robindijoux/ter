import { ApiProperty } from '@nestjs/swagger';
import { Sheet } from '../entities/sheet.entity';

export class SheetDto {
  @ApiProperty()
  id: String;
  @ApiProperty()
  courseLabel: String;
  @ApiProperty()
  courseStartDate: number;
  @ApiProperty()
  courseEndDate: number;
  @ApiProperty()
  teacherId: String;
  @ApiProperty()
  challenges: Object;

  constructor(sheet: Sheet) {
    this.id = sheet.id;
    this.courseLabel = sheet.courseLabel;
    this.courseStartDate = sheet.courseStartDate;
    this.courseEndDate = sheet.courseEndDate;
    this.teacherId = sheet.teacherId;
    this.challenges = Object.fromEntries(sheet.challenges);
  }
}
