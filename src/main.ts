import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const { router } = require('bull-board')
const basicAuth = require('express-basic-auth')
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/bull-dashboard/queues', basicAuth({
      users: {
        [process.env.BULL_DASHBOARD_USER]: process.env.BULL_DASHBOARD_PASSWORD,
      },
      challenge: true,
    }),
    router
  )

  await app.listen(3000);
}
bootstrap();
