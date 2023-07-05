import {
  ActionResponse,
  ClientErrorResponse,
  ErrorResponse,
  FailureResponse,
  PartialSuccessResponse,
  Response,
  ServerErrorResponse,
  SuccessResponse,
} from '../models/dto/response.dto';
import { ClientException } from '../models/exceptions/client.exception';
import { ServerException } from '../models/exceptions/server.exception';
import { StatusCode, Success } from '../models/dto.types';

/**
 * This utility returns an appropriate response body based on input
 *
 * @param result Custom payload returned with the response body
 * @param statusCode Status code given with the response body based on the HTTP-Codes
 */
export function respond<TResult>(
  result: TResult,
  statusCode: StatusCode,
): ActionResponse<TResult>;

/**
 * This utility returns an appropriate response body based on input
 *
 * @param error An error that should be returned in a response body in an appropriate form
 * @param statusCode Status code given with the response body based on the HTTP-Codes
 */
export function respond(
  error: Error | ClientException | ServerException,
  statusCode?: StatusCode,
): ErrorResponse;

/**
 * This utility returns an appropriate response body based on input
 *
 * @param result Custom payload returned with the response body
 * @param success Sets the success property of the response body
 * @param statusCode Status code given with the response body based on the HTTP-Codes
 */
export function respond<TResult>(
  result: TResult,
  success?: Success,
  statusCode?: StatusCode,
): ActionResponse<TResult>;

/**
 * This utility returns an appropriate response body based on input
 */
export function respond<TResult>(
  arg0: TResult | Error | ClientException | ServerException,
  arg1?: Success | StatusCode,
  arg2?: StatusCode,
): Response<TResult> {
  // Checks if the response body contains an error
  if (!(arg0 instanceof Error)) {
    // Some filtering is needed due to multiple overloads of the respond() function
    const statusCode: StatusCode =
      typeof arg1 === 'number' ? arg1 : arg2 ?? 200;
    const success: Success | undefined =
      typeof arg1 === 'number' ? !!arg0 : arg1 ?? !!arg0;

    // Return the appropriate response body based on the success property
    if (success === 'partial')
      return new PartialSuccessResponse(statusCode, { result: arg0 });
    return success
      ? new SuccessResponse(statusCode, { result: arg0 })
      : new FailureResponse(statusCode, { result: arg0 });
  }

  // Checks if the response is a client error
  if (arg0 instanceof ClientException) {
    return new ClientErrorResponse(
      (arg1 as StatusCode) ?? arg0.statusCode ?? 400,
      {
        error: arg0.name,
        message: arg0.message,
      },
    );
  }

  // If it there is an error and it is not a client error return a server error response body
  // If the error was of instance ServerException it should have an error code
  // You can recognize an uncaught/unexpected server error due to the error code being: 0x00
  return new ServerErrorResponse(
    (arg1 as StatusCode) ??
      (arg0 instanceof ServerException ? arg0.statusCode : 500) ??
      500,
    {
      error: arg0.name,
      message: arg0.message,
      stacktrace: arg0.stack as string,
      errorCode:
        arg0 instanceof ServerException ? arg0.errorCode ?? '0x00' : '0x00',
    },
  );
}
