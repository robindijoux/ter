import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  docRedir() {
    return {
      url: '/doc',
      statusCode: 301,
    };
  }
}
