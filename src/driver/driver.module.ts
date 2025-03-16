// Imports
import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { MongoService } from 'src/db/mongo';
import { mongoModels } from 'src/db/models/inject.mongo.models';
import { GoogleService } from 'src/thirdParty/google/google.service';
import { ApiService } from 'src/utils/api.service';

@Module({
  imports: [...mongoModels],
  controllers: [DriverController],
  providers: [ApiService, DriverService, GoogleService, MongoService],
})
export class DriverModule {}
