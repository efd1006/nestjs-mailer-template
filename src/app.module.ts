import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as AWS from 'aws-sdk'
import 'dotenv/config'

@Module({
  imports: [
    MailerModule.forRoot({
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
        dir: `${process.cwd()}/src/templates/email`,
        adapter: new HandlebarsAdapter(), // or  new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
