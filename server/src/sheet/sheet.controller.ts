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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Sheet } from './entities/sheet.entity';
import { SheetDto } from './dto/sheet.dto';

@Controller('sheet')
@ApiTags('sheet')
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
  findAll(@Query('studentId') studentId?: String) {
    if (studentId === undefined) {
      return this.sheetService.findAll().map((s) => new SheetDto(s));
    }
    return this.sheetService
      .findAll()
      .filter((s) => s.challenges.has(studentId))
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
}
