import { Injectable } from '@nestjs/common';

let total_emails: string[] = [];

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
    const email: string = reqData.email;
    if (!email) return { valid: false, error_msg: 'Please enter valid email' };
    const password = reqData.password;
    if (!password)
      return { valid: false, error_msg: 'Please enter valid password' };
    if (password < 6) 
      return { valid: false, error_msg: 'password must be 6 digit or more'};
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))  
      return { valid: false, error_msg: 'password must contain both uppercase and lowercase letters' };

    
    if (total_emails.includes(email)) return {valid: false, error_msg: "Email is already exists !"}
    
    total_emails.push(email);

    return { valid: true, total_emails };
  }

  async validateOtp(reqData) {
    const otp = reqData.otp;
    if (!otp) return { valid: false, error_msg: 'Please enter valid otp' };

    if (otp != '3567') {
      return { valid: false, error_msg: 'Please enter valid otp' };
    }

    return { valid: true };
  }

  async forgotpassword(reqData) {
    const otp = reqData.otp;

  }
  
  async validateOTPForForgetPassword(reqData) {
    

  }
}
