import { ClientException } from './client.exception';
/**
 * Used as an error when api does not support the request acceptable versions
 */
export declare class UnsupportedVersionException extends ClientException {
    constructor(stack?: string);
}
