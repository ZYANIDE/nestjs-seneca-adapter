import { Type } from '@nestjs/common';
import { ValidationError } from 'class-validator';
/**
 * Options given to the ValidateGenericRequestPipe
 */
export interface ValidateGenericRequestOptions {
    clientIdRequired?: boolean;
    type?: Type;
    errorMessageFactory?: (errors: ValidationError[]) => string;
}
