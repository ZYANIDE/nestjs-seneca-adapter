"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerErrorResponse = exports.ClientErrorResponse = exports.FailureResponse = exports.PartialSuccessResponse = exports.SuccessResponse = exports.BaseResponse = void 0;
const is_env_var_util_1 = require("../../utils/is-env-var.util");
/**
 * A class representing the base of every type or response
 */
class BaseResponse {
    constructor(success, statusCode, props) {
        Object.assign(this, props);
        this.appVersion = process.env.npm_package_version;
        this.success = success;
        this.statusCode = statusCode;
    }
}
exports.BaseResponse = BaseResponse;
/**
 * A class representing a response given on a successful execution of the request
 */
class SuccessResponse extends BaseResponse {
    constructor(statusCode, props) {
        super(true, statusCode, props);
    }
}
exports.SuccessResponse = SuccessResponse;
/**
 * A class representing a response given on a partial successful execution of the request
 */
class PartialSuccessResponse extends BaseResponse {
    constructor(statusCode, props) {
        super('partial', statusCode, props);
    }
}
exports.PartialSuccessResponse = PartialSuccessResponse;
/**
 * A class representing a response given on an unsuccessful execution of the request due to a conflict
 */
class FailureResponse extends BaseResponse {
    constructor(statusCode, props) {
        super(false, statusCode, props);
    }
}
exports.FailureResponse = FailureResponse;
/**
 * A class representing a response given on an unsuccessful execution of the request due to a client error
 */
class ClientErrorResponse extends BaseResponse {
    constructor(statusCode, props) {
        super(false, statusCode, props);
    }
}
exports.ClientErrorResponse = ClientErrorResponse;
/**
 * A class representing a response given on an unsuccessful execution of the request due to a server error
 */
class ServerErrorResponse extends BaseResponse {
    // if the VERBOSE flag is not set, hide everything except for the errorCode
    constructor(statusCode, props) {
        super(false, (0, is_env_var_util_1.isEnvVar)('VERBOSE') ? statusCode : 500, (0, is_env_var_util_1.isEnvVar)('VERBOSE')
            ? props
            : {
                errorCode: props.errorCode,
                error: '500: Internal error',
            });
    }
}
exports.ServerErrorResponse = ServerErrorResponse;
