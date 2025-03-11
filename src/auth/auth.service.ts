import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    return 'Hey there i am umang, calling from auth module test endpoint';
  }

  task1(): string {
    return 'Hey from 1';
  }

  task2(): string {
    return 'Hey from 2';
  }

  async signUp(reqData) {
    const email = reqData.email;
    if (!email) return { valid: false, error_msg: 'Please enter valid email' };
    const password = reqData.password;
    if (!password)
      return { valid: false, error_msg: 'Please enter valid password' };

    return { valid: true };
  }

  async validateOtp(reqData) {
    const otp = reqData.otp;
    if (!otp) return { valid: false, error_msg: 'Please enter valid otp' };

    if (otp != '3567') {
      return { valid: false, error_msg: 'Please enter valid otp' };
    }

    return { valid: true };
  }
}
