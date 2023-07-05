"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedVersionException = void 0;
const client_exception_1 = require("./client.exception");
/**
 * Used as an error when api does not support the request acceptable versions
 */
class UnsupportedVersionException extends client_exception_1.ClientException {
    constructor(stack) {
        super('UNSUPPORTED_API_VERSION', 'The API matching the given message pattern does not support any of the acceptable versions', 426, stack);
    }
}
exports.UnsupportedVersionException = UnsupportedVersionException;
