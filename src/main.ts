import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const cfg = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV == 'dev') {
    app.enableCors();
  }

  const port = process.env.PORT || cfg.port;
  await app.listen(port);
  logger.log(`App listening on port ${port}`);
}
bootstrap();
