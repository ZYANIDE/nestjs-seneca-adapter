import { AppVersion, StatusCode, Success } from '../dto.types';
/**
 * Properties used in every type of response
 */
interface BaseResponseProps {
    readonly appVersion: AppVersion;
    readonly statusCode?: StatusCode;
    readonly success: Success;
}
/**
 * Properties used in a 2xx response
 */
interface BaseSuccessResponseProps<TResult> {
    readonly result: TResult;
}
/**
 * Properties used in an error response
 */
interface BaseGenericErrorResponseProps {
    readonly error: string;
    readonly message: string;
}
/**
 * Additional properties used in an error response if it is a server error
 */
interface BaseServerErrorResponseProps {
    readonly stacktrace: string;
    readonly errorCode: string;
}
/**
 * A class representing the base of every type or response
 */
export declare class BaseResponse implements BaseResponseProps {
    readonly appVersion: AppVersion;
    readonly statusCode: StatusCode;
    readonly success: Success;
    constructor(success: Success, statusCode: StatusCode, props?: any);
}
/**
 * A class representing a response given on a successful execution of the request
 */
export declare class SuccessResponse<TResult> extends BaseResponse implements BaseSuccessResponseProps<TResult> {
    readonly result: TResult;
    constructor(statusCode: StatusCode, props: BaseSuccessResponseProps<TResult>);
}
/**
 * A class representing a response given on a partial successful execution of the request
 */
export declare class PartialSuccessResponse<TResult> extends BaseResponse implements BaseSuccessResponseProps<TResult> {
    readonly result: TResult;
    constructor(statusCode: StatusCode, props: BaseSuccessResponseProps<TResult>);
}
/**
 * A class representing a response given on an unsuccessful execution of the request due to a conflict
 */
export declare class FailureResponse<TResult> extends BaseResponse implements BaseSuccessResponseProps<TResult> {
    readonly result: TResult;
    constructor(statusCode: StatusCode, props: BaseSuccessResponseProps<TResult>);
}
/**
 * A class representing a response given on an unsuccessful execution of the request due to a client error
 */
export declare class ClientErrorResponse extends BaseResponse implements BaseGenericErrorResponseProps {
    readonly error: string;
    readonly message: string;
    constructor(statusCode: StatusCode, props: BaseGenericErrorResponseProps);
}
/**
 * A class representing a response given on an unsuccessful execution of the request due to a server error
 */
export declare class ServerErrorResponse extends BaseResponse implements BaseGenericErrorResponseProps, BaseServerErrorResponseProps {
    readonly error: string;
    readonly errorCode: string;
    readonly message: string;
    readonly stacktrace: string;
    constructor(statusCode: StatusCode, props: BaseGenericErrorResponseProps & BaseServerErrorResponseProps);
}
export type ActionResponse<TResult> = SuccessResponse<TResult> | PartialSuccessResponse<TResult> | FailureResponse<TResult>;
export type ErrorResponse = ClientErrorResponse | ServerErrorResponse;
export type Response<TResult> = ActionResponse<TResult> | ErrorResponse;
export {};
