// Imports
import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { ApiService } from 'src/utils/api.service';
import { mongoModels } from 'src/db/models/inject.mongo.models';
import { MongoService } from 'src/db/mongo';

@Module({
  imports: [...mongoModels],
  controllers: [GoogleController],
  providers: [ApiService, GoogleService, MongoService],
})
export class GoogleModule {}
