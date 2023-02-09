import { Signature } from '../../signature/model/signature/signature';

export class Sheet {
  id: string;
  courseLabel: string;
  courseStartDate: number;
  courseEndDate: number;
  teacherId: string;
  studentsSignatures: Map<string, Signature>;
  teacherSignature: Signature;
  isAttendanceOngoing: boolean;
}
