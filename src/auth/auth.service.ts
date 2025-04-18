// Imports
import { MongoService } from 'src/db/mongo';
import { HTTPError } from 'src/configs/error';
import { OTP_HTML } from 'src/constants/strings';
import { StrService } from 'src/utils/str.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { MailJetService } from 'src/thirdParty/mailjet/mail.jet.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly mongo: MongoService,
    private readonly mailJet: MailJetService,
    private readonly strService: StrService,
  ) {}

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
    const name: string = reqData.name;
    if (!name) {
      throw HTTPError({ parameter: 'name' });
    }

    const existingData = await this.mongo.findOne('User', { email });
    if (existingData) {
      throw HTTPError({
        message: 'Email is already exists',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const otp = this.strService.generateOTP({ length: 6 });
    await this.mongo.insert('User', { email, name, password, otp });
    await this.sendOTPMail(email, otp);

    return {
      message:
        'Account created successfuly! OTP has been sent on your email - ' +
        email,
    };
  }

  async validateOtp(reqData) {
    const otp = reqData.otp;
    if (!otp) throw HTTPError({ parameter: 'otp' });
    if (otp.length != 6) throw HTTPError({ value: 'otp' });
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    email = email.toLowerCase();

    const existingData = await this.mongo.findOne('User', { email });
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

    await this.mongo.updateOne('User', { email }, { isEmailVerified: true });

    await this.mongo.insert('Notification', {
      dateTime: new Date(),
      userId: existingData._id,
      content: `Your email has been verified !`,
    });

    return { id: existingData._id, message: 'OTP verified succefully !' };
  }

  async forgotpassword(reqData) {
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    email = email.toLowerCase();

    const existingData = await this.mongo.findOne('User', { email });
    if (!existingData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email not exist, Please try sign up instead.',
      });
    }

    const otp = this.strService.generateOTP({ length: 6 });
    await this.mongo.updateOne('User', { email }, { otp });
    await this.sendOTPMail(email, otp);

    return { message: 'OTP sent for forgot password' };
  }

  async validateOTPForForgetPassword(reqData) {
    let email: string = reqData.email;
    if (!email) throw HTTPError({ parameter: 'email' });
    if (!this.strService.isValidEmail(email))
      throw HTTPError({ value: 'email' });
    email = email.toLowerCase();
    const otp = reqData.otp;
    if (!otp) throw HTTPError({ parameter: 'otp' });
    if (otp.length != 6) throw HTTPError({ value: 'otp' });
    const password = reqData.password;
    if (!password) throw HTTPError({ parameter: 'password' });
    if (password < 6)
      throw HTTPError({ message: 'password must be 6 digit or more' });
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
      throw HTTPError({
        message: 'password must contain both uppercase and lowercase letters',
      });

    const existingData = await this.mongo.findOne('User', { email });
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

    await this.mongo.updateOne(
      'User',
      { email },
      { isEmailVerified: true, password },
    );

    return { id: existingData._id, message: 'Password changed successfully !' };
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
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'password must contain both uppercase and lowercase letters',
      });

    const existingData = await this.mongo.findOne('User', { email });
    if (!existingData) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email not exist, Please try sign up instead.',
      });
    }

    if (existingData.isActive == false) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          'Your account is not active, Kindly contact pullerduo2025@gmail.com for more',
      });
    }

    if (password != existingData.password) {
      throw HTTPError({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid Password, Please try again later',
      });
    }

    // New OTP
    if (!existingData.isEmailVerified) {
      const otp = this.strService.generateOTP({ length: 6 });
      await this.mongo.updateOne('User', { email }, { otp });
      await this.sendOTPMail(email, otp);
    }

    return {
      type: existingData.type,
      id: existingData._id,
      isEmailVerified: existingData.isEmailVerified,
      message: 'Login successful',
    };
  }

  private async sendOTPMail(email: string, otp: string) {
    await this.mailJet.sendMail({
      email,
      subject: 'OTP Verfication',
      htmlContent: OTP_HTML.replace('OTP_CODE', otp),
    });
  }
}
