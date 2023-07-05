import { Global, Module } from '@nestjs/common';
import { SenecaClient } from './seneca-client.service';

@Global()
@Module({
  providers: [SenecaClient],
  exports: [SenecaClient],
})
export class SenecaModule {}
