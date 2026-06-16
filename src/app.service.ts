import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
dotenv.config();

@Injectable()
export class AppService {
  private resend: Resend;
  private readonly logger = new Logger(AppService.name);
  constructor() {
    this.resend = new Resend(process.env.MAIL_PASS);
  }

  private getTemplateHtml(
    templateName: string,
    context: Record<string, any>,
  ): string {
    // Points to dist/mail/templates/templateName.hbs (thanks to nest-cli.json assets configuration)
    const templatePath = join(
      __dirname,
      'mail/templates',
      `${templateName}.hbs`,
    );

    // Read the template file content
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    // Compile it into a reusable Handlebars function
    const compiledTemplate = handlebars.compile(templateSource);

    // Inject the context variables (e.g., name) into the HTML template
    return compiledTemplate(context);
  }

  async getHello(): Promise<string> {
    const htmlContent = this.getTemplateHtml('welcome', { name: 'An Khang' });

    await this.resend.emails.send({
      from: process.env.MAIL_FROM ?? '',
      to: 'dellta103@gmail.com',
      subject: 'Welcome to Our App!',
      html: htmlContent,
    });
    this.logger.log(`Welcome email successfully sent to dellta103@gmail.com`);
    return 'Hello World!';
  }
}
