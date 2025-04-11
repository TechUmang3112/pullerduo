// Imports
import { UserService } from './user.service';
import { kUploadFileObj } from 'src/constants/objects';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('profile')
  async funProfile(@Query() query) {
    return await this.service.profile(query);
  }

  @Post('updateProfile')
  @UseInterceptors(FileInterceptor('file', kUploadFileObj()))
  async funUpdateProfile(@UploadedFile() file, @Body() body) {
    return await this.service.updateProfile({ file, ...body });
  }

  @Get('totalrides')
  async funtotalrides(@Body() Body) {
    return await this.service.totalrides(Body);
  }

  @Get('upcomingrides')
  async funupcomingrides(@Body() Body) {
    return await this.service.upcomingrides(Body);
  }

  @Get('currentride')
  async funcurrentride(@Body() Body) {
    return await this.service.currentride(Body);
  }

  @Get('completedrides')
  async funcompletedrides(@Body() Body) {
    return await this.service.completedrides(Body);
  }

  @Get('getRideCounts')
  async funGetRideCounts(@Query() query) {
    return await this.service.getRideCounts(query);
  }
}
