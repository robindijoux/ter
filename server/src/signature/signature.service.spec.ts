import { Test, TestingModule } from '@nestjs/testing';
import { Course } from '../course/entities/course.entity';
import { SheetModule } from '../sheet/sheet.module';
import { SignatureService } from './signature.service';

describe('SignatureService', () => {
  let service: SignatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignatureService],
      imports: [SheetModule],
    }).compile();

    service = module.get<SignatureService>(SignatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a signature challenge', () => {
    const studentList = ['student1', 'student2'];
    const teacherId = 'teacherId';
    const course: Course = {
      id: 'courseId',
      label: 'courseLabel',
      studentList,
      startDate: new Date().getTime(),
      endDate: new Date().getTime(),
      teacherId,
    };
    const { studentsSignatures, teacherSignature } =
      service.generateSignatureChallenges(
        'randomSheetId',
        studentList,
        teacherId,
      );
    expect(studentsSignatures.size).toBe(2);
    expect(teacherSignature).toBeDefined();
    console.log('studentsSignatures', studentsSignatures);
    console.log('teacherSignature', teacherSignature);
  });
});
