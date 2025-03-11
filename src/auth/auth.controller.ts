// Imports
import { AuthService } from './auth.service';
import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 @Get('test')
  getHello(): string {
    return this.authService.getHello();
  } 

  @Get('task1')
  task1(): string {
    return this.authService.task1();
  }

  @Get('task2')
  task2(): string {
    return this.authService.task2();
  }
}
