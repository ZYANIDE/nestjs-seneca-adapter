import { BaseException } from './base.exception';

/**
 * Used as a base for every client error
 * By using this as a base the respond() utility can differentiate between unexpected/server errors and known client errors
 */
export class ClientException extends BaseException {
  public readonly statusCode: number;

  constructor(
    name: string,
    message: string,
    statusCode: number,
    stack?: string,
  );
  constructor(name: string, message: string, stack?: string);
  constructor(
    arg0: string,
    arg1: string,
    arg2?: string | number,
    arg3?: string,
  ) {
    const statusCode: number = typeof arg2 === 'number' ? arg2 : 400;
    super(arg0, arg1, statusCode ? arg3 : (arg2 as string));
    this.statusCode = statusCode;
  }
}
