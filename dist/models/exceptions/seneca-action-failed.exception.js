"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenecaActionFailedException = void 0;
const base_exception_1 = require("./base.exception");
/**
 * Used as an error upon seneca failure
 */
class SenecaActionFailedException extends base_exception_1.BaseException {
    constructor(message, stack) {
        super('SENECA_ACTION_FAILED', message, stack);
    }
}
exports.SenecaActionFailedException = SenecaActionFailedException;
