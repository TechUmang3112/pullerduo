// Imports
import { Env } from 'src/constants/env';
import { Injectable } from '@nestjs/common';
import { nMailJet } from 'src/constants/network';
import { ApiService } from 'src/utils/api.service';

@Injectable()
export class MailJetService {
  constructor(private readonly api: ApiService) {}

  async sendMail(reqData) {
    const email = reqData.email;
    const subject = reqData.subject;
    const textContent = reqData.textContent;
    const htmlContent = reqData.htmlContent;

    const auth = Buffer.from(
      `${Env.thirdParty.mailJet.apiKey}:${Env.thirdParty.mailJet.secretKey}`,
    ).toString('base64');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    };

    const body = {
      Messages: [
        {
          From: {
            Email: 'pullerduo2025@gmail.com',
            Name: 'PullerDuo',
          },
          To: [
            {
              Email: email,
              Name: 'User',
            },
          ],
          Subject: subject,
          TextPart: textContent,
          HTMLPart: htmlContent,
        },
      ],
    };

    const response = await this.api.post(nMailJet.baseUrl, body, headers);

    return { response };
  }
}
