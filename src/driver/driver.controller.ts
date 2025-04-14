// Imports
import { DriverService } from './driver.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('driver')
export class DriverController {
  constructor(private readonly service: DriverService) {}

  @Post('offerRide')
  async funOfferRide(@Body() body) {
    return await this.service.offerRide(body);
  }

  @Post('cancelRide')
  async funCancelRide(@Body() body) {
    return await this.service.cancelRide(body);
  }

  @Post('startRide')
  async funStartRide(@Body() body) {
    return await this.service.startRide(body);
  }

  @Get('myRides')
  async funMyRides(@Query() query) {
    return await this.service.myRides(query);
  }
}
