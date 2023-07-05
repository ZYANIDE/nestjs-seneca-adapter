import { AppVersion, StatusCode, Success } from '../dto.types';
import { isEnvVar } from '../../utils/is-env-var.util';

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
export class BaseResponse implements BaseResponseProps {
  public readonly appVersion: AppVersion;
  public readonly statusCode: StatusCode;
  public readonly success: Success;

  constructor(success: Success, statusCode: StatusCode, props?: any) {
    Object.assign(this, props);
    this.appVersion = process.env.npm_package_version as string;
    this.success = success;
    this.statusCode = statusCode;
  }
}

/**
 * A class representing a response given on a successful execution of the request
 */
export class SuccessResponse<TResult>
  extends BaseResponse
  implements BaseSuccessResponseProps<TResult>
{
  public readonly result!: TResult;

  constructor(
    statusCode: StatusCode,
    props: BaseSuccessResponseProps<TResult>,
  ) {
    super(true, statusCode, props);
  }
}

/**
 * A class representing a response given on a partial successful execution of the request
 */
export class PartialSuccessResponse<TResult>
  extends BaseResponse
  implements BaseSuccessResponseProps<TResult>
{
  public readonly result!: TResult;

  constructor(
    statusCode: StatusCode,
    props: BaseSuccessResponseProps<TResult>,
  ) {
    super('partial', statusCode, props);
  }
}

/**
 * A class representing a response given on an unsuccessful execution of the request due to a conflict
 */
export class FailureResponse<TResult>
  extends BaseResponse
  implements BaseSuccessResponseProps<TResult>
{
  public readonly result!: TResult;

  constructor(
    statusCode: StatusCode,
    props: BaseSuccessResponseProps<TResult>,
  ) {
    super(false, statusCode, props);
  }
}

/**
 * A class representing a response given on an unsuccessful execution of the request due to a client error
 */
export class ClientErrorResponse
  extends BaseResponse
  implements BaseGenericErrorResponseProps
{
  public readonly error!: string;
  public readonly message!: string;

  constructor(statusCode: StatusCode, props: BaseGenericErrorResponseProps) {
    super(false, statusCode, props);
  }
}

/**
 * A class representing a response given on an unsuccessful execution of the request due to a server error
 */
export class ServerErrorResponse
  extends BaseResponse
  implements BaseGenericErrorResponseProps, BaseServerErrorResponseProps
{
  public readonly error!: string;
  public readonly errorCode!: string;
  public readonly message!: string;
  public readonly stacktrace!: string;

  // if the VERBOSE flag is not set, hide everything except for the errorCode
  constructor(
    statusCode: StatusCode,
    props: BaseGenericErrorResponseProps & BaseServerErrorResponseProps,
  ) {
    super(
      false,
      isEnvVar('VERBOSE') ? statusCode : 500,
      isEnvVar('VERBOSE')
        ? props
        : {
            errorCode: props.errorCode,
            error: '500: Internal error',
          },
    );
  }
}

export type ActionResponse<TResult> =
  | SuccessResponse<TResult>
  | PartialSuccessResponse<TResult>
  | FailureResponse<TResult>;
export type ErrorResponse = ClientErrorResponse | ServerErrorResponse;
export type Response<TResult> = ActionResponse<TResult> | ErrorResponse;
