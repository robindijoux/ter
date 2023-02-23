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
import { SheetService } from './sheet.service';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import {
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

@Controller('sheet')
@ApiTags('Sheet')
export class SheetController {
  constructor(private readonly sheetService: SheetService) {}

  @Post()
  @ApiCreatedResponse({ type: SheetDto })
  create(@Body() createSheetDto: CreateSheetDto) {
    let res = this.sheetService.create(createSheetDto);
    if (res === undefined) {
      throw new HttpException("Canno't create Sheet", HttpStatus.BAD_REQUEST);
    }
    return new SheetDto(res);
  }

  @Get()
  @ApiQuery({
    name: 'studentId',
    type: String,
    description: 'The target studentId',
    required: false,
  })
  @ApiFoundResponse({ type: [SheetDto] })
  findAll(@Query('studentId') studentId?: string) {
    if (studentId === undefined) {
      return this.sheetService.findAll().map((s) => new SheetDto(s));
    }
    return this.sheetService
      .findAllByStudentId(studentId)
      .map((s) => new SheetDto(s));
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
  @ApiCreatedResponse({ description: 'Attendance is successfully closed.' })
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
    return { message: 'Attendance successfully resumed' };
  }
}
