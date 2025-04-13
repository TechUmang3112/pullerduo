// Imports
import { MailJetService } from './mail.jet.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('thirdParty/mailJet')
export class MailjetController {
  constructor(private readonly service: MailJetService) {}

  @Post('sendMail')
  async funSendMail(@Body() body) {
    return await this.service.sendMail(body);
  }
}
