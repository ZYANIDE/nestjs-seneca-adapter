import { Injectable, PipeTransform } from '@nestjs/common';

type Body<T extends object> = { payload: T | undefined };

/**
 * The value returned from the last used transform() method is given as payload to the controller action
 * With this pipeline only the request.payload property will be given
 */
@Injectable()
export class ExtractPayloadPipe implements PipeTransform {
  transform<T extends Body<B>, B extends object>(value: T): T | B | undefined {
    return value.payload;
  }
}
