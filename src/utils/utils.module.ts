// Imports
import { Module } from '@nestjs/common';
import { StrService } from './str.service';
import { FileService } from './file.service';
import { ApiService } from './api.service';

@Module({ providers: [ApiService, FileService, StrService] })
export class UtilsModule {}
