import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

dotenv.config();

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.MAIL_PASS);
  }

  private getTemplateHtml(
    templateName: string,
    context: Record<string, any>,
  ): string {
    // Points to dist/mail/templates/templateName.hbs
    const templatePath = join(__dirname, 'templates', `${templateName}.hbs`);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(context);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const htmlContent = this.getTemplateHtml('welcome', { name });

    await this.resend.emails.send({
      from: process.env.MAIL_FROM ?? '',
      to,
      subject: 'Welcome to Our App!',
      html: htmlContent,
    });

    this.logger.log(`Welcome email successfully sent to ${to}`);
  }
}
