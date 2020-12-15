import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import * as AWS from 'aws-sdk'
import 'dotenv/config'
import { MailProcessor } from './mail.processor';
import { MAIL_QUEUE } from 'src/constants';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          SES: new AWS.SES({
            accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
            region: process.env.AWS_SES_REGION
          })
        },
        defaults: {
          from: `"8Layer Test" <${process.env.MAILER_SOURCE}>`,
        },
        template: {
          dir: `${process.cwd()}/src/mail/templates`,
          adapter: new HandlebarsAdapter(), // or  new PugAdapter()
          options: {
            strict: true,
          },
        },
      })
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService]
})
export class MailModule { }
