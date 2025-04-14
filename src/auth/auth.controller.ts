// Imports
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async funSignUp(@Body() body) {
    return await this.authService.signUp(body);
  }

  @Post('validateOtp')
  async funValidateOtp(@Body() body) {
    return await this.authService.validateOtp(body);
  }

  @Post('forgotpassword')
  async funForgotpassword(@Body() body) {
    return await this.authService.forgotpassword(body);
  }

  @Post('validateOTPForForgetPassword')
  async funvalidateOTPForForgotpassword(@Body() body) {
    return await this.authService.validateOTPForForgetPassword(body);
  }

  @Post('login')
  async funLogIn(@Body() body) {
    return await this.authService.login(body);
  }
}
