// Imports
import { AdminService } from './admin.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('users')
  async funUsers() {
    return await this.service.users();
  }

  @Get('drivers')
  async funDrivers() {
    return await this.service.drivers();
  }

  @Get('riders')
  async funRiders() {
    return await this.service.riders();
  }

  @Post('updateUserStatus')
  async funUpdateUserStatus(@Body() body) {
    return await this.service.updateUserStatus(body);
  }

  @Get('pendingApprovals')
  async funPendingApprovals() {
    return await this.service.pendingApprovals();
  }
}
