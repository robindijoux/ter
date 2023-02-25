import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AttendanceStatusUpdateWebSocketGateway } from '../attendance-status-update-web-socket/attendance-status-update-web-socket.gateway';
import { CourseService } from '../course/course.service';
import { SheetUpdateWebSocketGateway } from '../sheet-update-web-socket/sheet-update-web-socket.gateway';
import { SignatureRequest } from '../signature/model/signature-request/signature-request';
import { SignatureService } from '../signature/signature.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { EndAttendanceRequestDto } from './dto/endAttendanceRequest.dto';
import { SheetDto } from './dto/sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { AttendanceStatus, Sheet } from './entities/sheet.entity';

let sheets: Sheet[] = [];

export enum CreationErrorCode {
  COURSE_NOT_FOUND,
  ONGOING_ATTENDANCE,
}

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
      return CreationErrorCode.COURSE_NOT_FOUND;
    }

    // check if the teacher doesn't already have an attendance ongoing/interrupted
    if (
      this.findAllFilteredBy(undefined, course.teacherId, [
        AttendanceStatus.OPEN,
      ]).length > 0 ||
      this.findAllFilteredBy(undefined, course.teacherId, [
        AttendanceStatus.INTERRUPTED,
      ]).length > 0
    ) {
      return CreationErrorCode.ONGOING_ATTENDANCE;
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

    return newSheet;
  }

  findAll() {
    return sheets;
  }

  findAllFilteredBy(
    studentId: string | undefined,
    teacherId: string | undefined,
    attendanceStatus: [AttendanceStatus] | undefined,
  ) {
    let res = this.findAll();
    if (studentId !== undefined) {
      res = res.filter((s) => s.studentsSignatures.has(studentId));
    }
    if (teacherId !== undefined) {
      res = res.filter((s) => s.teacherId === teacherId);
    }
    if (attendanceStatus !== undefined) {
      res = res.filter((s) => attendanceStatus.includes(s.attendanceStatus));
    }

    let dtoRes = res.map((s) => new SheetDto(s));
    return dtoRes;
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

  completeSheet(
    sheetId: string,
    endAttendanceRequest: EndAttendanceRequestDto,
  ) {
    let sheet = this.findOne(sheetId);
    if (sheet === undefined) {
      return undefined;
    }

    // check if the teacher signature is valid
    if (
      !this.signatureService.checkSignatureRequest(
        new SignatureRequest(
          sheet.teacherId,
          sheetId,
          endAttendanceRequest.teacherSignature,
        ),
      )
    ) {
      return false;
    }

    // update teacher signature
    sheet.teacherSignature.signature = endAttendanceRequest.teacherSignature;

    sheet.attendanceStatus = AttendanceStatus.CLOSED;

    // for each student whitelisted by teacher, mark it as present
    for (let studentId of endAttendanceRequest.whiteList) {
      if (sheet.studentsSignatures.has(studentId)) {
        sheet.studentsSignatures.get(studentId)!.signature =
          'approved by teacher';
      }

      // remove the student from the list of students signatures to check, if it was present
      delete endAttendanceRequest.studentsSignatures[studentId];
    }

    // for each remaining student signature, check if the signature is valid
    for (let [studentId, signature] of Object.entries(
      endAttendanceRequest.studentsSignatures,
    )) {
      if (
        sheet.studentsSignatures.has(studentId) &&
        this.signatureService.checkSignatureRequest(
          new SignatureRequest(studentId, sheetId, signature),
        )
      ) {
        sheet.studentsSignatures.get(studentId)!.signature = signature;
      }
    }

    console.log('completeSheet', JSON.stringify(sheet));

    this.attendanceStatusUpdateWebSocket.publishAttendanceStatusUpdate(
      sheet.id,
      sheet.attendanceStatus,
    );
    return true;
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
