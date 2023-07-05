/**
 * Used as base for every exception the application can use
 * Allows easier error creation due to being able to give a 3rd party stacktrace upon initialization
 */
export declare class BaseException extends Error {
    name: string;
    message: string;
    constructor(name: string, message: string, stack?: string);
}
