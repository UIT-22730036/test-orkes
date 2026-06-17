import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailService) {}

  async getHello(): Promise<string> {
    await this.mailService.sendWelcomeEmail('dellta103@gmail.com', 'An Khang');
    return 'Hello World!';
  }
}
