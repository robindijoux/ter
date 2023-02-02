import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiQuery({
    name: 'teacherId',
    type: String,
    description: 'The target teacherId',
    required: false,
  })
  @ApiFoundResponse({ type: [Course] })
  findAll(@Query('teacherId') id?: string) {
    if (id === undefined) {
      return this.courseService.findAll();
    }
    return this.courseService.findAllByTeacherId(id);
  }

  @Get(':id')
  @ApiFoundResponse({ type: Course })
  findOne(@Param('id') id: string) {
    let res = this.courseService.findOne(id);
    if (res === undefined)
      throw new HttpException('Id ' + id + ' not found.', HttpStatus.NOT_FOUND);
    return res;
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
