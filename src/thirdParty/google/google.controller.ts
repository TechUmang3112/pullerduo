// Imports
import { GoogleService } from './google.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('thirdParty/google')
export class GoogleController {
  constructor(private readonly service: GoogleService) {}

  @Get('searchPlaces')
  async funSearchPlaces(@Query() query) {
    return await this.service.searchPlaces(query);
  }

  @Post('measureDistance')
  async funMeasureDistance(@Body() body) {
    return await this.service.measureDistance(body);
  }
}
