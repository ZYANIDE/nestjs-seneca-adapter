import { ValidateGenericRequestPipe as VGRP } from './validate-generic-request.pipe';
import { IGenericRequest } from '../models/dto/request.dto';
import { ClientException } from '../models/exceptions/client.exception';
import { ValidateGenericRequestOptions } from '../models/options/validate-generic-request.options';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';

class ValidateGenericRequestPipe extends VGRP {
  public _options?: ValidateGenericRequestOptions;
  public _validatorOptions!: ValidatorOptions;
}

describe('ValidateGenericRequestPipe', () => {
  let pipe: ValidateGenericRequestPipe;
  beforeEach(() => {
    pipe = new ValidateGenericRequestPipe(undefined, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should throw ClientException on missing clientId', () => {
    pipe._options ??= {};
    pipe._options.clientIdRequired = true;
    const func = () =>
      pipe.transform({
        cmd: 'lorem',
        role: 'ipsum',
      } as any);

    expect(jest.fn(func)).toThrow(ClientException);
  });

  it('should throw ClientException on missing cmd', () => {
    const func = () =>
      pipe.transform({
        role: 'ipsum',
      } as any);

    expect(jest.fn(func)).toThrow(ClientException);
  });

  it('should throw ClientException on missing role', () => {
    const func = () =>
      pipe.transform({
        cmd: 'lorem',
      } as any);

    expect(jest.fn(func)).toThrow(ClientException);
  });

  it('should return body on success', () => {
    const body: IGenericRequest<any> = {
      cmd: 'lorem',
      role: 'ipsum',
    };

    const value = pipe.transform(body as any);
    expect(value).toStrictEqual(body);
  });

  it('should throw ClientException on non-object bodies', () => {
    const func = (body: any) => () => pipe.transform(body);
    const testValues: any[] = [
      'string',
      0,
      10,
      true,
      false,
      NaN,
      undefined,
      null,
      [],
      ['values'],
    ];

    testValues.forEach((val) => expect(jest.fn(func(val))).toThrow());
  });

  it('should be successful with payload property on strict', () => {
    const body: IGenericRequest<any> = {
      cmd: 'lorem',
      role: 'ipsum',
      payload: { key: 'value' },
    };

    const value = pipe.transform(body as any);
    expect(value).toStrictEqual(body);
  });

  it('should throw ClientException on unspecified properties on strict', () => {
    const func = () =>
      pipe.transform({
        clientId: 1,
        cmd: 'lorem',
        role: 'ipsum',
        unknownProp: 'value',
      });

    expect(jest.fn(func)).toThrow(ClientException);
  });
});
