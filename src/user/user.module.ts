// Imports
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongoService } from 'src/db/mongo';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/db/models/user.model';
import { FileService } from 'src/utils/file.service';
import { FileDoc, FileDocSchema } from 'src/db/models/file.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: FileDoc.name, schema: FileDocSchema }]),
  ],
  controllers: [UserController],
  providers: [FileService, MongoService, UserService],
})
export class UserModule {}
