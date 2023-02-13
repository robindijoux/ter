import { Signature } from '../../signature/model/signature/signature';

export class Sheet {
  id: string;
  courseLabel: string;
  courseStartDate: number;
  courseEndDate: number;
  teacherId: string;
  studentsSignatures: Map<string, Signature>;
  teacherSignature: Signature;
  attendanceStatus: AttendanceStatus;
}

export enum AttendanceStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  INTERRUPTED = 'INTERRUPTED',
}
