import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ExtractPayloadPipe,
  globalPipe,
  ValidateGenericRequestPipe,
} from 'nestjs-seneca-adapter';
import { RequestScopedPipe } from './request-scoped.pipe';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    RequestScopedPipe, // Provide the dependency injected pipes first as provider before using it

    // All pipes given in this utility will be used in order as globalPipes
    globalPipe(
      new ValidateGenericRequestPipe(),
      new ExtractPayloadPipe(),
      new ValidationPipe(),
      RequestScopedPipe, // Dependency injected pipe
    ),
  ],
})
export class AppModule {}
