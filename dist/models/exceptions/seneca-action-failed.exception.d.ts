import { BaseException } from './base.exception';
/**
 * Used as an error upon seneca failure
 */
export declare class SenecaActionFailedException extends BaseException {
    constructor(message: string, stack?: string);
}
