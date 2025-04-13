// Imports
import { Module } from '@nestjs/common';
import { MailJetService } from './mail.jet.service';
import { UtilsModule } from 'src/utils/utils.module';
import { MailjetController } from './mail.jet.controller';

@Module({
  controllers: [MailjetController],
  exports: [MailJetService],
  imports: [UtilsModule],
  providers: [MailJetService],
})
export class MailJetModule {}
