import { Injectable } from '@nestjs/common';
import { IEmail } from './interfaces/emai.interface';
import { MailService } from './mail/mail.service';

@Injectable()
export class AppService {

  constructor(private readonly mailService: MailService) { }

  async sendEmail(email: string | IEmail | Array<string | IEmail>) {
    return this.mailService.sendEmail(email)
  }

  getHello(): string {
    return 'Hello World!';
  }
}
