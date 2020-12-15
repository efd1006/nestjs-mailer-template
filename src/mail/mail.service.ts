import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
const { setQueues, BullMQAdapter, BullAdapter } = require('bull-board')
import 'dotenv/config'
import { MAIL_QUEUE, SEND_EMAIL } from 'src/mail/constants';
import { IEmail } from 'src/mail/interfaces/emai.interface';

@Injectable()
export class MailService {
	private readonly logger = new Logger(this.constructor.name)

  constructor(
    @InjectQueue(MAIL_QUEUE) private mailQueue: Queue,
  ) {

    setQueues([new BullAdapter(this.mailQueue)])
  }

  /** Send email */
  async sendEmail(email: string | IEmail | Array<string | IEmail>) {
    try {
      const job = await this.mailQueue.add(SEND_EMAIL, {
        email
      }, {attempts: 3})
      return job
    } catch (error) {
      this.logger.error(`Error queueing send_email to email address ${email}`)
      return null
    }
  }

  getQueue() {
    return this.mailQueue
  }
}
