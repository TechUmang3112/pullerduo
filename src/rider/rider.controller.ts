// Imports
import { RiderService } from './rider.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('rider')
export class RiderController {
  constructor(private readonly service: RiderService) {}

  @Post('findRide')
  async funFindRide(@Body() body) {
    return await this.service.findRide(body);
  }

  @Post('acceptRide')
  async funAcceptRide(@Body() body) {
    return await this.service.acceptRide(body);
  }

  @Get('myRides')
  async funMyRides(@Query() query) {
    return await this.service.myRides(query);
  }

  @Post('cancelRide')
  async funCancelRide(@Body() body) {
    return await this.service.cancelRide(body);
  }

  @Post('payForRide')
  async funPayForRide(@Body() body) {
    return await this.service.payForRide(body);
  }

  @Post('rateRide')
  async funRateRide(@Body() body) {
    return await this.service.rateRide(body);
  }

  @Post('initiatePayment')
  async funInitiatePayment(@Body() body) {
    return await this.service.initiatePayment(body);
  }
}
