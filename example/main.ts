import 'nestjs-seneca-adapter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SenecaApplication,
  DefaultExceptionFilter,
} from 'nestjs-seneca-adapter';
import config from './app.config';

async function bootstrap() {
  // create a seneca microservice using NestFactory.createSenecaMicroservice()
  const app: SenecaApplication = await NestFactory.createSenecaMicroservice(
    AppModule,
    config,
  );

  // Use the defaultExceptionFilter to catch and respond to thrown errors responsibly
  app.useGlobalFilters(new DefaultExceptionFilter());

  app.enableVersioning();

  await app.listen();
}
bootstrap();
