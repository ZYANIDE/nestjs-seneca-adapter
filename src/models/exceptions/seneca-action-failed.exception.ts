import { BaseException } from './base.exception';

/**
 * Used as an error upon seneca failure
 */
export class SenecaActionFailedException extends BaseException {
  constructor(message: string, stack?: string) {
    super('SENECA_ACTION_FAILED', message, stack);
  }
}
