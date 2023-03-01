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
import { CreationErrorCode, SheetService } from './sheet.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SheetDto } from './dto/sheet.dto';
import { EndAttendanceRequestDto } from './dto/endAttendanceRequest.dto';
import { AttendanceStatus, Sheet } from './entities/sheet.entity';

@Controller('sheet')
@ApiTags('Sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Post()
  @ApiCreatedResponse({ type: SheetDto })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiConflictResponse({ description: 'Teacher already have an attendance' })
  create(@Body() createSheetDto: CreateSheetDto) {
    let res = this.sheetService.create(createSheetDto);
    if (res === CreationErrorCode.COURSE_NOT_FOUND) {
      throw new HttpException("Can't create Sheet", HttpStatus.BAD_REQUEST);
    }
    if (res === CreationErrorCode.ONGOING_ATTENDANCE) {
      throw new HttpException("Can't create Sheet", HttpStatus.CONFLICT);
    }
    return new SheetDto(res);
  }

  @Get()
  @ApiQuery({
    name: 'studentId',
    type: String,
    description: 'The studentId filter to apply.',
    required: false,
  })
  @ApiQuery({
    name: 'teacherId',
    type: String,
    description: 'The teacherId filter to apply.',
    required: false,
  })
  @ApiQuery({
    name: 'attendanceStatus',
    enum: AttendanceStatus,
    isArray: true,
    description: 'The attendance status filter to apply',
    required: false,
  })
  @ApiFoundResponse({
    type: [SheetDto],
    description:
      'List of sheets. If no query parameter is set, all sheets are returned.',
  })
  findAll(
    @Query('studentId') studentId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('attendanceStatus') attendanceStatus?: [AttendanceStatus],
  ) {
    return this.sheetService.findAllFilteredBy(
      studentId,
      teacherId,
      attendanceStatus,
    );
  }

  @Get(':id')
  @ApiFoundResponse({ type: SheetDto })
  findOne(@Param('id') id: string) {
    let res = this.sheetService.findOne(id);
    if (res === undefined) {
      throw new HttpException(
        'Sheet ' + id + ' not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return new SheetDto(res);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSheetDto: UpdateSheetDto) {
    return this.sheetService.update(id, updateSheetDto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sheetService.remove(id);
  }

  @Post(':id/attendanceStop')
  @ApiOperation({
    summary:
      "Stop attendance. The next students signatures won't be authorized anymore.",
  })
  @ApiNotFoundResponse({ description: 'Sheet not found' })
  @ApiCreatedResponse({ description: 'Attendance successfully stopped' })
  stopAttendance(@Param('id') id: string) {
    let res = this.sheetService.stopAttendance(id);
    if (res === undefined) {
      throw new HttpException(
        'Sheet ' + id + ' not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Attendance successfully stopped' };
  }

  @Post(':id/attendanceResume')
  @ApiOperation({
    summary:
      'Resume the attendance. The next students signatures will be authorized.',
  })
  @ApiNotFoundResponse({ description: 'Sheet not found' })
  @ApiCreatedResponse({ description: 'Attendance successfully resumed' })
  resumeAttendance(@Param('id') id: string) {
    let res = this.sheetService.resumeAttendance(id);
    if (res === undefined) {
      throw new HttpException(
        'Sheet ' + id + ' not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Attendance successfully resumed' };
  }

  @Post(':id/attendanceEnd')
  @ApiOperation({
    summary:
      'Terminate the attendance and complete the sheet if the teacher signature is valid.',
  })
  @ApiNotFoundResponse({ description: 'Sheet not found' })
  @ApiUnauthorizedResponse({ description: "Invalid teacher's Signature." })
  @ApiCreatedResponse({ description: 'Attendance is successfully terminated.' })
  terminateAttendance(
    @Param('id') id: string,
    @Body() endAttendanceRequestDto: EndAttendanceRequestDto,
  ) {
    let res = this.sheetService.completeSheet(id, endAttendanceRequestDto);
    if (res === undefined) {
      throw new HttpException(
        'Sheet ' + id + ' not found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Attendance successfully terminated' };
  }
}
