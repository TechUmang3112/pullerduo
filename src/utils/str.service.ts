// Imports
import { Injectable } from '@nestjs/common';

@Injectable()
export class StrService {
  isValidEmail(email: string): boolean {
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  generateOTP(reqData: { length: number }) {
    const digits = '0123456789'; // All possible digits for the OTP
    let otp = '';

    for (let i = 0; i < reqData.length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length); // Random index
      otp += digits[randomIndex]; // Append the random digit to the OTP
    }

    return otp;
  }
}
