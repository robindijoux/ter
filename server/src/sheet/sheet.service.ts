import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureRequest } from '../signature/model/signature-request/signature-request';
import { SignatureService } from '../signature/signature.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { SheetDto } from './dto/sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { Sheet } from './entities/sheet.entity';

let sheets: Sheet[] = [];

@Injectable()
export class SheetService {
  public constructor(
    @Inject(forwardRef(() => SignatureService))
    private signatureService: SignatureService,
    private courseService: CourseService,
    private webSocket: SheetUpdateWebSocketGateway,
  ) {
    this.create({
      courseId: '1',
    });
  }

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
      course.teacherId,
    );

    // create the new sheet
    let newSheet: Sheet = {
      id: new Date().getTime() + '',
      courseLabel: course.label,
      courseStartDate: course.startDate,
      courseEndDate: course.endDate,
      teacherId: course.teacherId,
      studentsSignatures: signatures.studentsSignatures,
      teacherSignature: signatures.teacherSignature,
      isAttendanceOngoing: true,
    };

    // store new sheet
    sheets.push(newSheet);

    // mock signature
    // this.mockSignature(newSheet);

    this.webSocket.publishSheetUpdate(newSheet.id, new SheetDto(newSheet));
    return newSheet;
  }

  findAll() {
    return sheets.filter((s) => s.isAttendanceOngoing);
  }

  findAllByStudentId(studentId: string) {
    return this.findAll().filter((s) => s.studentsSignatures.has(studentId));
  }

  findOne(id: string) {
    return sheets.find((sheet) => sheet.id === id && sheet.isAttendanceOngoing);
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
    let sheet = sheets.find((sheet) => sheet.id === signatureRequest.sheetId);
    if (sheet === undefined) {
      console.log('sheet not found');
      return false;
    }
    // check if it's a student signature
    let target = sheet.studentsSignatures.get(signatureRequest.personId);
    if (target !== undefined) {
      // in case of student signature
      if (!sheet.isAttendanceOngoing) {
        // the attendance must be ongoing. Trigger failure.
        console.log('attendance not ongoing');
        return false;
      }
    } else {
      // in case of teacher signature
      target = sheet.teacherSignature;
      if (sheet.isAttendanceOngoing) {
        // the attendance must be stopped. Trigger the stop.
        sheet.isAttendanceOngoing = false;
      }
    }
    // update the signature
    target.signature = signatureRequest.signature;

    // publish sheet update
    this.webSocket.publishSheetUpdate(sheet.id, new SheetDto(sheet));

    return true;
  }

  stopAttendance(id: string) {
    let sheet = this.findOne(id);
    if (sheet === undefined) {
      return undefined;
    }
    sheet.isAttendanceOngoing = false;
    return sheet;
  }

  mockSignature(sheet: Sheet) {
    let i = 0;
    const timer = setInterval(() => {
      let studentId = Array.from(sheet.studentsSignatures.keys())[i];
      this.addSignature({
        sheetId: sheet.id,
        personId: studentId,
        signature: 'présent',
      });
      if (++i == sheet.studentsSignatures.size) {
        clearInterval(timer);
      }
    }, 5000);
  }
}
