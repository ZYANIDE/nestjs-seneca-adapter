"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientException = void 0;
const base_exception_1 = require("./base.exception");
/**
 * Used as a base for every client error
 * By using this as a base the respond() utility can differentiate between unexpected/server errors and known client errors
 */
class ClientException extends base_exception_1.BaseException {
    constructor(arg0, arg1, arg2, arg3) {
        const statusCode = typeof arg2 === 'number' ? arg2 : 400;
        super(arg0, arg1, statusCode ? arg3 : arg2);
        this.statusCode = statusCode;
    }
}
exports.ClientException = ClientException;
