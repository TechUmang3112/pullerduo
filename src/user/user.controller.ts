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
}
