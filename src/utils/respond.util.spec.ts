import { StatusCode, Success } from '../models/dto.types';
import { respond } from './respond.util';
import {
  PartialSuccessResponse,
  SuccessResponse,
  FailureResponse,
  ClientErrorResponse,
  ServerErrorResponse,
  BaseResponse,
} from '../models/dto/response.dto';
import { ClientException } from '../models/exceptions/client.exception';
import { ServerException } from '../models/exceptions/server.exception';
import { Type } from '@nestjs/common';

describe('respond()', () => {
  const errorResponses: Type[] = [ClientErrorResponse, ServerErrorResponse];
  const testRespondFunction = (
    input: any,
    success: Success,
    returnInstances: Type | Type[],
  ) => {
    if (!Array.isArray(returnInstances)) returnInstances = [returnInstances];
    const response = respond(input, success);
    expect(
      returnInstances.some((type) => response instanceof type),
    ).toBeTruthy();
  };
  const cacheEnvVar = (key: string, tmpValue: any, cb: () => void) => {
    const cache = process.env[key];
    process.env[key] = tmpValue;
    cb();
    process.env[key] = cache;
  };

  it('should return a SuccessResponse on no error and success is true', () => {
    testRespondFunction({}, true, SuccessResponse);
  });

  it('should return a PartialSuccessResponse on no error success is partial', () => {
    testRespondFunction({}, 'partial', PartialSuccessResponse);
  });

  it('should return a FailureResponse on no error success is false', () => {
    testRespondFunction({}, false, FailureResponse);
  });

  it('should return an ErrorResponse on error and success is true', () => {
    testRespondFunction(new Error(), true, errorResponses);
  });

  it('should return an ErrorResponse on error and success is partial', () => {
    testRespondFunction(new Error(), 'partial', errorResponses);
  });

  it('should return an ErrorResponse on error and success is false', () => {
    testRespondFunction(new Error(), false, errorResponses);
  });

  it('should return a ClientErrorResponse on ClientException error', () => {
    testRespondFunction(
      new ClientException('name', 'msg'),
      false,
      ClientErrorResponse,
    );
  });

  it('should return a ServerErrorResponse on ServerException', () => {
    testRespondFunction(
      new ServerException(new Error(), 'errCode'),
      false,
      ServerErrorResponse,
    );
  });

  it('should return a ServerErrorResponse on any other Error', () => {
    testRespondFunction(new Error(), false, ServerErrorResponse);
  });

  const testResponseStatusCode = (
    input: any,
    success: Success,
    expectedStatusCode: StatusCode,
    statusCode?: StatusCode,
  ) => {
    const response: BaseResponse = respond(
      input,
      (input instanceof Error ? statusCode : success) as any,
      statusCode,
    );
    expect(response.statusCode).toBe(expectedStatusCode);
  };

  it('should give SuccessResponse a default statusCode of 200', () => {
    testResponseStatusCode({}, true, 200);
  });

  it('should give PartialSuccessResponse a default statusCode of 200', () => {
    testResponseStatusCode({}, 'partial', 200);
  });

  it('should give FailureResponse a default statusCode of 200', () => {
    testResponseStatusCode({}, false, 200);
  });

  it('should give ClientErrorResponse a default statusCode of 400', () => {
    testResponseStatusCode(new ClientException('name', 'msg'), true, 400);
  });

  it('should give ServerErrorResponse by ServerException a default statusCode of 500', () => {
    testResponseStatusCode(
      new ServerException(new Error(), 'errCode'),
      false,
      500,
    );
  });

  it('should give ServerErrorResponse by any Error a default statusCode of 500', () => {
    testResponseStatusCode(new Error(), false, 500);
  });

  const testStatusCodeValues = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  ];

  it('should reflect the statusCode of SuccessResponse to the given statusCode', () => {
    testStatusCodeValues.forEach((statusCode) =>
      testResponseStatusCode({}, true, statusCode, statusCode),
    );
  });

  it('should reflect the statusCode of PartialSuccessResponse to the given statusCode', () => {
    testStatusCodeValues.forEach((statusCode) =>
      testResponseStatusCode({}, 'partial', statusCode, statusCode),
    );
  });

  it('should reflect the statusCode of FailureResponse to the given statusCode', () => {
    testStatusCodeValues.forEach((statusCode) =>
      testResponseStatusCode({}, false, statusCode, statusCode),
    );
  });

  it('should reflect the statusCode of ClientErrorResponse to the given statusCode', () => {
    testStatusCodeValues.forEach((statusCode) =>
      testResponseStatusCode(
        new ClientException('name', 'msg'),
        false,
        statusCode,
        statusCode,
      ),
    );
  });

  it('should reflect the statusCode of ServerErrorResponse by ServerException to the given statusCode if VERBOSE is true', () => {
    cacheEnvVar('VERBOSE', true, () => {
      testStatusCodeValues.forEach((statusCode) =>
        testResponseStatusCode(
          new ServerException(new Error(), 'errCode'),
          false,
          statusCode,
          statusCode,
        ),
      );
    });
  });

  it('should reflect the statusCode of ServerErrorResponse by any Error to the given statusCode if VERBOSE is true', () => {
    cacheEnvVar('VERBOSE', true, () => {
      testStatusCodeValues.forEach((statusCode) =>
        testResponseStatusCode(new Error(), false, statusCode, statusCode),
      );
    });
  });
});
