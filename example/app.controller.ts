import { Controller, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { respond, Response } from 'nestjs-seneca-adapter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // This will result in a message pattern: {action: 'test', role: DEFAULT_ROLE }
  // The default role is determined by your app settings
  @MessagePattern('test')
  getHello(): Response<string> {
    // use the respond() utility to generate responses
    return respond(this.appService.getHello());
  }

  @MessagePattern('payload')
  returnPayload(payload: any): Response<any> {
    return respond(payload);
  }

  @MessagePattern('versioning')
  versioning_default(): Response<any> {
    return respond('default');
  }

  @Version('1')
  @MessagePattern('versioning')
  versioning_1(): Response<any> {
    return respond('first');
  }

  @Version('2')
  @MessagePattern('versioning')
  versioning_2(): Response<any> {
    return respond('second');
  }

  @Version(['3', '4'])
  @MessagePattern('versioning')
  versioning_3_and_4(): Response<any> {
    return respond('multi');
  }
}
