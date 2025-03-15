// Imports
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongoService } from 'src/db/mongo';
import { FileService } from 'src/utils/file.service';
import { mongoModels } from 'src/db/models/inject.mongo.models';

@Module({
  imports: [...mongoModels],
  controllers: [UserController],
  providers: [FileService, MongoService, UserService],
})
export class UserModule {}
