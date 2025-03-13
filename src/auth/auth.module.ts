// Imports
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StrService } from 'src/utils/str.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, StrService],
})
export class AuthModule {}
