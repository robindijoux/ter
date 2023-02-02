import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

let courses: Course[] = [
  {
    id: '1',
    label: "Travail d'étude et de recherche",
    teacherId: '1',
    studentList: ['1', '2', '3'],
    startDate: new Date().getTime(),
    endDate: new Date().getTime() + 3600 * 1000,
  },
  {
    id: '2',
    label: 'Concurrence',
    teacherId: '1',
    studentList: ['2', '3'],
    startDate: new Date().getTime() + 3600 * 1000,
    endDate: new Date().getTime() + 2 * 3600 * 1000,
  },
  {
    id: '3',
    label: 'Algo',
    teacherId: '2',
    studentList: ['1', '3'],
    startDate: new Date().getTime() + 2 * 3600 * 1000,
    endDate: new Date().getTime() + 3 * 3600 * 1000,
  },
];

@Injectable()
export class CourseService {
  create(createCourseDto: CreateCourseDto) {
    // TODO
    return 'This action adds a new course';
  }

  findAll() {
    return courses;
  }

  findOne(id: string) {
    return courses.find((course) => course.id === id);
  }

  findAllByTeacherId(teacherId: string) {
    return courses.filter((course) => course.teacherId === teacherId);
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    // TODO
    return `This action updates a #${id} course`;
  }

  remove(id: string) {
    // TODO
    return `This action removes a #${id} course`;
  }
}
