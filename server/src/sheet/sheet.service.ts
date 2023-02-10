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
    let sheet = this.findOne(signatureRequest.sheetId);
    if (sheet === undefined) {
      return false;
    }
    let target = sheet.studentsSignatures.get(signatureRequest.personId);
    if (target !== undefined) {
      // in case of student signature
      if (!sheet.isAttendanceOngoing) {
        // the attendance must be ongoing. Trigger failure.
        return false;
      }
    } else {
      // it's not a student signature. It must be a teacher signature.
      target = sheet.teacherSignature;
      if (target === undefined) {
        // it's neither a valid teacher signature or student signature. Trigger failure.
        return false;
      }
      // in case of teacher signature
      else if (sheet.isAttendanceOngoing) {
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
}
