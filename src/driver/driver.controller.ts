// Imports
import { DriverService } from './driver.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('driver')
export class DriverController {
  constructor(private readonly service: DriverService) {}

  @Post('offerRide')
  async funOfferRide(@Body() body) {
    return await this.service.offerRide(body);
  }
}
