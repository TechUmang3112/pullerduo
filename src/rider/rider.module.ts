// Imports
import { Module } from '@nestjs/common';
import { MongoService } from 'src/db/mongo';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { mongoModels } from 'src/db/models/inject.mongo.models';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [...mongoModels, UtilsModule],
  controllers: [RiderController],
  providers: [MongoService, RiderService],
})
export class RiderModule {}
