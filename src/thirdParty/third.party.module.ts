// Imports
import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';

@Module({ imports: [GoogleModule] })
export class ThirdPartyModule {}
