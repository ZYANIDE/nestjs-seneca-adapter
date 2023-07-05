import { BaseException } from './base.exception';
import { ServerErrorResponse } from '../dto/response.dto';
import { StatusCode } from '../dto.types';

/**
 * Used as a base for every server error
 * By using this as a base the respond() utility can differentiate between unexpected server-/known client errors and expected server errors
 */
export class ServerException extends BaseException {
  public readonly errorCode?: string;
  public readonly statusCode: StatusCode;

  constructor(error: ServerErrorResponse | Error, errorCode?: string);
  constructor(
    error: ServerErrorResponse | Error,
    statusCode: StatusCode,
    errorCode?: string,
  );
  constructor(
    arg0: ServerErrorResponse | Error,
    arg1?: string | StatusCode,
    arg2?: string,
  ) {
    const error = arg0 as any;
    super(
      error.name ?? error.error,
      error.message,
      error.stack ?? error.stacktrace,
    );

    this.errorCode =
      (typeof arg1 === 'number' ? arg2 : arg1) ?? error.errorCode;
    this.statusCode = typeof arg1 === 'number' ? arg1 : 500;
  }
}
