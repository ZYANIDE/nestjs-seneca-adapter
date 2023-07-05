"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerException = void 0;
const base_exception_1 = require("./base.exception");
/**
 * Used as a base for every server error
 * By using this as a base the respond() utility can differentiate between unexpected server-/known client errors and expected server errors
 */
class ServerException extends base_exception_1.BaseException {
    constructor(arg0, arg1, arg2) {
        var _a, _b, _c;
        const error = arg0;
        super((_a = error.name) !== null && _a !== void 0 ? _a : error.error, error.message, (_b = error.stack) !== null && _b !== void 0 ? _b : error.stacktrace);
        this.errorCode =
            (_c = (typeof arg1 === 'number' ? arg2 : arg1)) !== null && _c !== void 0 ? _c : error.errorCode;
        this.statusCode = typeof arg1 === 'number' ? arg1 : 500;
    }
}
exports.ServerException = ServerException;
