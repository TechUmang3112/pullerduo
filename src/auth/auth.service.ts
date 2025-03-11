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
}
