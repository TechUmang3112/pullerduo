// Imports
import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { MongoService } from 'src/db/mongo';
import { mongoModels } from 'src/db/models/inject.mongo.models';

@Module({
  imports: [...mongoModels],
  controllers: [DriverController],
  providers: [DriverService, MongoService],
})
export class DriverModule {}
