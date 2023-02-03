import { Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { Sheet } from './entities/sheet.entity';

let sheets: Sheet[] = [];

@Injectable()
export class SheetService {
  public constructor(private courseService: CourseService) {}

  create(createSheetDto: CreateSheetDto) {
    // retrieve course information
    let course = this.courseService.findOne(createSheetDto.courseId);
    if (course === undefined) {
      return undefined;
    }

    // challenges
    let challenges = new Map<String, boolean>(
      course.studentList.map((s) => [s, false]),
    );

    // create the new sheet
    let newSheet: Sheet = {
      id: new Date().getTime() + '',
      courseLabel: course.label,
      courseStartDate: course.startDate,
      courseEndDate: course.endDate,
      teacherId: course.teacherId,
      challenges: challenges,
    };

    // store new sheet
    sheets.push(newSheet);

    return newSheet;
  }

  findAll() {
    return sheets;
  }

  findOne(id: string) {
    return sheets.find((sheet) => sheet.id === id);
  }

  update(id: string, updateSheetDto: UpdateSheetDto) {
    // TODO
    return `This action updates a #${id} sheet`;
  }

  remove(id: string) {
    // TODO
    return `This action removes a #${id} sheet`;
  }
}
