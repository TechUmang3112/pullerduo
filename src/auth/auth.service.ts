// Imports
import { HTTPError } from 'src/configs/error';
import { StrService } from 'src/utils/str.service';
import { HttpStatus, Injectable } from '@nestjs/common';

let total_emails: string[] = [];
let total_accounts: { email: string; password: string; otp: string }[] = [];

@Injectable()
export class AuthService {
  constructor(private readonly strService: StrService) {}

  getHello(): string {
    return 'Hey there i am umang, calling from auth module test endpoint';
  }

  async signUp(reqData) {
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    email = email.toLowerCase();
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    const password = reqData.password;
    if (!password) throw HTTPError({ parameter: 'password' });
    if (password < 6)
      throw HTTPError({ message: 'password must be 6 digit or more' });
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
      throw HTTPError({
        message: 'password must contain both uppercase and lowercase letters',
      });

    if (total_emails.includes(email)) {
      throw HTTPError({
        message: 'Email is already exists',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    total_emails.push(email);
    const otp = this.strService.generateOTP({ length: 4 });
    total_accounts.push({ email, password, otp });

    return {
      message:
        'Account created successfuly! OTP has been sent on your email - ' +
        email,
      otp,
    };
  }

  async validateOtp(reqData) {
    const otp = reqData.otp;
    if (!otp) throw HTTPError({ parameter: 'otp' });
    if (otp.length != 4) throw HTTPError({ value: 'otp' });
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    email = email.toLowerCase();

    const existingData = total_accounts.find((el) => el.email == email);
    if (!existingData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email not exist, Please try sign up instead.',
      });
    }

    if (otp != existingData.otp) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid OTP, Please try again later',
      });
    }

    return { message: 'OTP verified succefully !' };
  }

  async forgotpassword(reqData) {
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    email = email.toLowerCase();

    const index = total_accounts.findIndex((el) => el.email == email);
    if (index == -1) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email not exist, Please try sign up instead.',
      });
    }

    const otp = this.strService.generateOTP({ length: 4 });
    total_accounts[index].otp = otp;
    return { otp, message: 'OTP sent for forgot password' };
  }

  async validateOTPForForgetPassword(reqData) {
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    email = email.toLowerCase();
    const otp = reqData.otp;
    if (!otp) throw HTTPError({ parameter: 'otp' });
    if (otp.length != 4) throw HTTPError({ value: 'otp' });
    const password = reqData.password;
    if (!password) throw HTTPError({ parameter: 'password' });
    if (password < 6)
      throw HTTPError({ message: 'password must be 6 digit or more' });
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
      throw HTTPError({
        message: 'password must contain both uppercase and lowercase letters',
      });

    const index = total_accounts.findIndex((el) => el.email == email);
    if (index == -1) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email not exist, Please try sign up instead.',
      });
    }

    if (otp != total_accounts[index].otp) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid OTP, Please try again later',
      });
    }

    total_accounts[index].password = password;
    return { message: 'Password changed successfully !' };
  }

  async login(reqData) {
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    email = email.toLowerCase();
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    const password = reqData.password;
    if (!password) throw HTTPError({ parameter: 'password' });
    if (password < 6)
      throw HTTPError({ message: 'password must be 6 digit or more' });
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
      throw HTTPError({
        message: 'password must contain both uppercase and lowercase letters',
      });

    const existingData = total_accounts.find((el) => el.email == email);
    if (!existingData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email not exist, Please try sign up instead.',
      });
    }

    if (password != existingData.password) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid Password, Please try again later',
      });
    }

    return { message: "Login successful" };
  }
}
