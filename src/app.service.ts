import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface Address {
  name: string;
  address: string;
}

@Injectable()
export class AppService {

  constructor(private readonly mailerService: MailerService) { }

  async sendEmail(email: string | Address | Array<string | Address>): Promise<void> {
    return this
      .mailerService
      .sendMail({
        to: email,
        from: process.env.MAIL_FROM,
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'test', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'John Snow',
        },
      })
  }

  getHello(): string {
    return 'Hello World!';
  }
}
