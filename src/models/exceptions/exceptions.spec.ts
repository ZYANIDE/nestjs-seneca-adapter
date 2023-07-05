import { Type } from '@nestjs/common';
import { SenecaActionFailedException } from './seneca-action-failed.exception';
import { UnsupportedVersionException } from './unsupported-version.exception';

describe('Exceptions', () => {
  const exceptionTypes: Type[] = [
    SenecaActionFailedException,
    UnsupportedVersionException,
  ];

  for (const type of exceptionTypes) {
    it(`ExceptionType of '${type.name}' should be definable`, () => {
      expect(new type()).toBeDefined();
    });
  }
});
