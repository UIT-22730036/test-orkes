import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly mailService: MailerService) {}
  async getHello(): Promise<string> {
    await this.mailService.sendMail({
      to: 'ankhang261096@gmail.com',
      subject: 'Welcome to Our App!',
      template: './mail/templates/welcome', // Points to src/mail/templates/welcome.hbs
      context: {
        name: 'An Khang', // Variables passed into the Handlebars template
      },
    });
    this.logger.log(
      `Welcome email successfully sent to ankhang261096@gmail.com`,
    );
    return 'Hello World!';
  }
}
