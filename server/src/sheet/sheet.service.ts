import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { SignatureRequest } from '../signature/model/signature-request/signature-request';
import { SignatureService } from '../signature/signature.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { Sheet } from './entities/sheet.entity';

let sheets: Sheet[] = [];

@Injectable()
export class SheetService {
  public constructor(
    @Inject(forwardRef(() => SignatureService))
    private signatureService: SignatureService,
    private courseService: CourseService,
  ) {}

  create(createSheetDto: CreateSheetDto) {
    // retrieve course information
    let course = this.courseService.findOne(createSheetDto.courseId);
    if (course === undefined) {
      return undefined;
    }

    // challenges

    let signatures = this.signatureService.generateSignatureChallenges(
      course,
      course.studentList,
    );

    // create the new sheet
    let newSheet: Sheet = {
      id: new Date().getTime() + '',
      courseLabel: course.label,
      courseStartDate: course.startDate,
      courseEndDate: course.endDate,
      teacherId: course.teacherId,
      signatures: signatures,
    };

    // store new sheet
    sheets.push(newSheet);

    return newSheet;
  }

  findAll() {
    return sheets;
  }

  findAllByStudentId(studentId: string) {
    return this.findAll().filter((s) => s.signatures.has(studentId));
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

  addSignature(signatureRequest: SignatureRequest) {
    // get the sheet
    let sheet = this.findOne(signatureRequest.sheetId);
    if (sheet === undefined) {
      return false;
    }
    // get the target signature's row
    let target = sheet.signatures.get(signatureRequest.personId);
    if (target === undefined) {
      return false;
    }
    // update the signature
    target.signature = signatureRequest.signature;

    return true;
  }
}
