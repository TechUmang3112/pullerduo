// Imports
import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { MailJetModule } from './mailjet/mail.jet.module';

@Module({ imports: [GoogleModule, MailJetModule] })
export class ThirdPartyModule {}
