import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AttendanceStatusUpdateWebSocketGateway } from '../attendance-status-update-web-socket/attendance-status-update-web-socket.gateway';
import { CourseService } from '../course/course.service';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureRequest } from '../signature/model/signature-request/signature-request';
import { SignatureService } from '../signature/signature.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { SheetDto } from './dto/sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { AttendanceStatus, Sheet } from './entities/sheet.entity';

let sheets: Sheet[] = [];

@Injectable()
export class SheetService {
  public constructor(
    private signatureService: SignatureService,
    private courseService: CourseService,
    private sheetUpdateWebSocket: SheetUpdateWebSocketGateway,
    private attendanceStatusUpdateWebSocket: AttendanceStatusUpdateWebSocketGateway,
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

    let sheetId = crypto.randomUUID();

    // challenges

    let signatures = this.signatureService.generateSignatureChallenges(
      sheetId,
      course.studentList,
      course.teacherId,
    );

    // create the new sheet
    let newSheet: Sheet = {
      id: sheetId,
      courseLabel: course.label,
      courseStartDate: course.startDate,
      courseEndDate: course.endDate,
      teacherId: course.teacherId,
      studentsSignatures: signatures.studentsSignatures,
      teacherSignature: signatures.teacherSignature,
      attendanceStatus: AttendanceStatus.OPEN,
    };

    // store new sheet
    sheets.push(newSheet);

    // mock signature
    // this.mockSignature(newSheet);

    this.sheetUpdateWebSocket.publishSheetUpdate(
      newSheet.id,
      new SheetDto(newSheet),
    );
    return newSheet;
  }

  findAll() {
    return sheets;
  }

  findAllByStudentId(studentId: string) {
    return this.findAll().filter((s) => s.studentsSignatures.has(studentId));
  }

  findAllByTecherId(teacherId: string) {
    return this.findAll().filter((s) => s.teacherId === teacherId);
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
    console.log('addSignature', JSON.stringify(signatureRequest));

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
      if (!(sheet.attendanceStatus === AttendanceStatus.OPEN)) {
        // the attendance must be ongoing. Trigger failure.
        console.log('attendance not open');
        return false;
      }
      // update the signature
      target.signature = signatureRequest.signature;
    } else {
      // in case of teacher signature
      target = sheet.teacherSignature;
      sheet.attendanceStatus = AttendanceStatus.CLOSED;
      this.attendanceStatusUpdateWebSocket.publishAttendanceStatusUpdate(
        sheet.id,
        sheet.attendanceStatus,
      );
      sheet.teacherSignature.signature = signatureRequest.signature;
    }

    // publish sheet update
    this.sheetUpdateWebSocket.publishSheetUpdate(sheet.id, new SheetDto(sheet));

    return true;
  }

  stopAttendance(id: string) {
    let sheet = this.findOne(id);
    if (sheet === undefined) {
      return undefined;
    }
    sheet.attendanceStatus = AttendanceStatus.INTERRUPTED;
    this.attendanceStatusUpdateWebSocket.publishAttendanceStatusUpdate(
      sheet.id,
      sheet.attendanceStatus,
    );
    return sheet;
  }

  resumeAttendance(id: string) {
    let sheet = this.findOne(id);
    if (sheet === undefined) {
      return undefined;
    }
    sheet.attendanceStatus = AttendanceStatus.OPEN;
    this.attendanceStatusUpdateWebSocket.publishAttendanceStatusUpdate(
      sheet.id,
      sheet.attendanceStatus,
    );
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
