"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const response_dto_1 = require("../models/dto/response.dto");
const client_exception_1 = require("../models/exceptions/client.exception");
const server_exception_1 = require("../models/exceptions/server.exception");
/**
 * This utility returns an appropriate response body based on input
 */
function respond(arg0, arg1, arg2) {
    var _a, _b, _c, _d, _e;
    // Checks if the response body contains an error
    if (!(arg0 instanceof Error)) {
        // Some filtering is needed due to multiple overloads of the respond() function
        const statusCode = typeof arg1 === 'number' ? arg1 : arg2 !== null && arg2 !== void 0 ? arg2 : 200;
        const success = typeof arg1 === 'number' ? !!arg0 : arg1 !== null && arg1 !== void 0 ? arg1 : !!arg0;
        // Return the appropriate response body based on the success property
        if (success === 'partial')
            return new response_dto_1.PartialSuccessResponse(statusCode, { result: arg0 });
        return success
            ? new response_dto_1.SuccessResponse(statusCode, { result: arg0 })
            : new response_dto_1.FailureResponse(statusCode, { result: arg0 });
    }
    // Checks if the response is a client error
    if (arg0 instanceof client_exception_1.ClientException) {
        return new response_dto_1.ClientErrorResponse((_b = (_a = arg1) !== null && _a !== void 0 ? _a : arg0.statusCode) !== null && _b !== void 0 ? _b : 400, {
            error: arg0.name,
            message: arg0.message,
        });
    }
    // If it there is an error and it is not a client error return a server error response body
    // If the error was of instance ServerException it should have an error code
    // You can recognize an uncaught/unexpected server error due to the error code being: 0x00
    return new response_dto_1.ServerErrorResponse((_d = (_c = arg1) !== null && _c !== void 0 ? _c : (arg0 instanceof server_exception_1.ServerException ? arg0.statusCode : 500)) !== null && _d !== void 0 ? _d : 500, {
        error: arg0.name,
        message: arg0.message,
        stacktrace: arg0.stack,
        errorCode: arg0 instanceof server_exception_1.ServerException ? (_e = arg0.errorCode) !== null && _e !== void 0 ? _e : '0x00' : '0x00',
    });
}
exports.respond = respond;
