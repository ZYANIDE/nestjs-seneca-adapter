import { Injectable, PipeTransform } from '@nestjs/common';
import { ClientException } from '../models/exceptions/client.exception';
import {
  GenericClientRequest,
  GenericRequest,
} from '../models/dto/request.dto';
import { validateSync } from 'class-validator';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';
import { plainToClass } from 'class-transformer';
import { ValidateGenericRequestOptions } from '../models/options/validate-generic-request.options';

/**
 * Validates the incoming request as GenericRequest
 */
@Injectable()
export class ValidateGenericRequestPipe implements PipeTransform {
  constructor(
    protected readonly _options?: ValidateGenericRequestOptions,
    protected readonly _validatorOptions: ValidatorOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
    },
  ) {}

  public transform<T extends object>(value: T): T {
    // if the incoming request was not converted into a json format throw a 415 error
    if (typeof value !== 'object')
      throw new ClientException(
        'Unsupported Media Type',
        'The request given body did not resolve into: application/json',
        415,
      );

    const type =
      this._options?.type ?? this._options?.clientIdRequired
        ? GenericClientRequest
        : GenericRequest;

    // Instantiate the GenericRequest class and transfer all incoming values to it for validation
    // The class is instantiated since the NPM-package class-validator won't work otherwise
    const genericRequest = plainToClass(type, value);

    // Check for errors and if any found, generate the error message and throw it
    const validationErrors = validateSync(
      genericRequest,
      this._validatorOptions,
    );
    if (validationErrors.length > 0) {
      const errorMessage =
        this._options?.errorMessageFactory?.(validationErrors) ??
        Object.values(validationErrors[0].constraints ?? {})[0];
      throw new ClientException('Bad Request', errorMessage, 400);
    }

    // If everything is ok, return the value
    return value;
  }
}
