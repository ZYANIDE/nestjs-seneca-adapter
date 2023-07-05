import { BaseException } from './base.exception';
/**
 * Used as a base for every client error
 * By using this as a base the respond() utility can differentiate between unexpected/server errors and known client errors
 */
export declare class ClientException extends BaseException {
    readonly statusCode: number;
    constructor(name: string, message: string, statusCode: number, stack?: string);
    constructor(name: string, message: string, stack?: string);
}
