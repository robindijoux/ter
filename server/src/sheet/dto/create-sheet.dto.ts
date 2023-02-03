import { ApiProperty } from '@nestjs/swagger';

export class CreateSheetDto {
  @ApiProperty()
  courseId: string;
}
