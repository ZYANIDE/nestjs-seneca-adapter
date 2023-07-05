"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
/**
 * Used as base for every exception the application can use
 * Allows easier error creation due to being able to give a 3rd party stacktrace upon initialization
 */
class BaseException extends Error {
    constructor(name, message, stack) {
        super();
        this.name = name;
        this.message = message;
        this.stack = stack !== null && stack !== void 0 ? stack : this.stack;
    }
}
exports.BaseException = BaseException;
