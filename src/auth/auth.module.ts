// Imports
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StrService } from 'src/utils/str.service';
import { MongoService } from 'src/db/mongo';
import { mongoModels } from 'src/db/models/inject.mongo.models';

@Module({
  imports: [...mongoModels],
  controllers: [AuthController],
  providers: [AuthService, MongoService, StrService],
})
export class AuthModule {}
