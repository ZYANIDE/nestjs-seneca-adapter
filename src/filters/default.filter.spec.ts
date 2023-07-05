import { ArgumentsHost, ExceptionFilter, Logger } from '@nestjs/common';
import { DefaultExceptionFilter } from './default.filter';
import {
  ClientErrorResponse,
  FailureResponse,
  PartialSuccessResponse,
  ServerErrorResponse,
  SuccessResponse,
} from '../models/dto/response.dto';
import { ServerException } from '../models/exceptions/server.exception';
import { ClientException } from '../models/exceptions/client.exception';

describe('DefaultExceptionFilter', () => {
  const testFilterCatch = (
    error: Error = {} as Error,
    host: ArgumentsHost = {} as ArgumentsHost,
  ) => filter.catch(error, host);
  let filter: ExceptionFilter;

  beforeAll(() => {
    jest.spyOn(Logger, 'error').mockImplementation(() => {
      /* do nothing */
    });
  });
  beforeEach(() => {
    filter = new DefaultExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should always return a Response', () => {
    // All types of {Response} from 'response.dto'
    const isResponse = (value: any) =>
      value instanceof SuccessResponse ||
      value instanceof PartialSuccessResponse ||
      value instanceof FailureResponse ||
      value instanceof ClientErrorResponse ||
      value instanceof ServerErrorResponse;
    expect(isResponse(testFilterCatch())).toBeTruthy();
  });

  const testErrorLog = (error: Error, shouldLog: boolean) => {
    const spy = jest.spyOn(Logger, 'error');
    testFilterCatch(error);
    if (shouldLog) expect(spy).toHaveBeenCalledWith(error);
    else expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
  };

  it('should log on ServerException', () => {
    testErrorLog(new ServerException(new Error(), ''), true);
  });

  it('should log on Error', () => {
    testErrorLog(new Error(), true);
  });

  it('should not log on ClientException', () => {
    testErrorLog(new ClientException('', ''), false);
  });
});
