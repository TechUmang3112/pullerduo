// Imports
import { Module } from '@nestjs/common';
import { MongoService } from 'src/db/mongo';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { mongoModels } from 'src/db/models/inject.mongo.models';

@Module({
  imports: [...mongoModels],
  controllers: [AdminController],
  providers: [AdminService, MongoService],
})
export class AdminModule {}
