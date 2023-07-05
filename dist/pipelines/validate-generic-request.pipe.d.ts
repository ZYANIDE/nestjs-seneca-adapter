import { PipeTransform } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';
import { ValidateGenericRequestOptions } from '../models/options/validate-generic-request.options';
/**
 * Validates the incoming request as GenericRequest
 */
export declare class ValidateGenericRequestPipe implements PipeTransform {
    protected readonly _options?: ValidateGenericRequestOptions | undefined;
    protected readonly _validatorOptions: ValidatorOptions;
    constructor(_options?: ValidateGenericRequestOptions | undefined, _validatorOptions?: ValidatorOptions);
    transform<T extends object>(value: T): T;
}
