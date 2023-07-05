import { ActionResponse, ErrorResponse } from '../models/dto/response.dto';
import { ClientException } from '../models/exceptions/client.exception';
import { ServerException } from '../models/exceptions/server.exception';
import { StatusCode, Success } from '../models/dto.types';
/**
 * This utility returns an appropriate response body based on input
 *
 * @param result Custom payload returned with the response body
 * @param statusCode Status code given with the response body based on the HTTP-Codes
 */
export declare function respond<TResult>(result: TResult, statusCode: StatusCode): ActionResponse<TResult>;
/**
 * This utility returns an appropriate response body based on input
 *
 * @param error An error that should be returned in a response body in an appropriate form
 * @param statusCode Status code given with the response body based on the HTTP-Codes
 */
export declare function respond(error: Error | ClientException | ServerException, statusCode?: StatusCode): ErrorResponse;
/**
 * This utility returns an appropriate response body based on input
 *
 * @param result Custom payload returned with the response body
 * @param success Sets the success property of the response body
 * @param statusCode Status code given with the response body based on the HTTP-Codes
 */
export declare function respond<TResult>(result: TResult, success?: Success, statusCode?: StatusCode): ActionResponse<TResult>;
