// Imports
import { Module } from '@nestjs/common';
import { StrService } from './str.service';
import { FileService } from './file.service';

@Module({ providers: [FileService, StrService] })
export class UtilsModule {}
