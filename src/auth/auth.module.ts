// Imports
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StrService } from 'src/utils/str.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/db/models/user.model';
import { MongoService } from 'src/db/mongo';
import { FileDoc, FileDocSchema } from 'src/db/models/file.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: FileDoc.name, schema: FileDocSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MongoService, StrService],
})
export class AuthModule {}
