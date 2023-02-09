import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRequest } from './dto/authentication-request/authentication-request';
import { User } from './model/user/user';

@Controller('authentication')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User found and authentication done',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  login(
    @Body() authenticationRequest: AuthenticationRequest,
  ): User | HttpException {
    let user = this.authenticationService.login(authenticationRequest);
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
