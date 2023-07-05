import { Injectable, PipeTransform, Scope } from '@nestjs/common';
import { randomBytes } from 'crypto';

/**
 * returns incoming payload with a random value to prove the scope of request is working
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestScopedPipe implements PipeTransform {
  private readonly _randomValue: string;

  constructor() {
    this._randomValue = randomBytes(20).toString('hex');
  }

  transform(value: any): any {
    return {
      original: value,
      random: this._randomValue,
    };
  }
}
