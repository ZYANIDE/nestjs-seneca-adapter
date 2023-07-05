import { BaseException } from './base.exception';
import { ServerErrorResponse } from '../dto/response.dto';
import { StatusCode } from '../dto.types';
/**
 * Used as a base for every server error
 * By using this as a base the respond() utility can differentiate between unexpected server-/known client errors and expected server errors
 */
export declare class ServerException extends BaseException {
    readonly errorCode?: string;
    readonly statusCode: StatusCode;
    constructor(error: ServerErrorResponse | Error, errorCode?: string);
    constructor(error: ServerErrorResponse | Error, statusCode: StatusCode, errorCode?: string);
}
