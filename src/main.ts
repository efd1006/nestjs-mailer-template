import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const { router } = require('bull-board')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // can be placed in a controller with proper authentication
  app.use('/admin/queues', router)

  await app.listen(3000);
}
bootstrap();
