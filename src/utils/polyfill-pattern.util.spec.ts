import { Pattern, PatternObject, PatternString } from '../models/seneca.types';
import { Type } from '@nestjs/common';
import { polyfillPattern } from './polyfill-pattern.util';
import jsonic from 'jsonic';

describe('polyfillPattern()', () => {
  const DEFAULT_ROLE = 'DEFAULT_ROLE';
  const testPatternEffect = <T>(
    expectFn: (func: () => void, value: T) => void,
    testData: [patternIn: any, value: T][],
  ) => {
    for (const [patternIn, value] of testData) {
      const func = () => polyfillPattern(patternIn, DEFAULT_ROLE);
      expectFn(func, value);
    }
  };

  const patternTestData: [
    patternIn: any,
    error: Type<Error> | undefined,
    patternOut: PatternString | undefined,
  ][] = [
    [
      'action',
      undefined,
      jsonic.stringify({ cmd: 'action', role: DEFAULT_ROLE }),
    ],
    [null, Error, undefined],
    [undefined, Error, undefined],
    [
      'action,role:another',
      undefined,
      jsonic.stringify({ cmd: 'action,role:another', role: DEFAULT_ROLE }),
    ],
    [true, Error, undefined],
    [false, Error, undefined],
    [0, Error, undefined],
    [4, Error, undefined],
    [
      { cmd: 'lorem' },
      undefined,
      jsonic.stringify({ cmd: 'lorem', role: DEFAULT_ROLE }),
    ],
    [{ role: 'someRole' }, Error, undefined],
    [
      { cmd: 'ipsum', role: 'someRole' },
      undefined,
      jsonic.stringify({ cmd: 'ipsum', role: 'someRole' }),
    ],
  ];

  it('should not throw when polyfilling pattern is possible', () => {
    testPatternEffect<Type<Error> | undefined>(
      (func, error) => {
        if (error === undefined) expect(func).not.toThrow();
        else expect(func).toThrow(error);
      },
      patternTestData.map((x) => [x[0], x[1]]),
    );
  });

  it('should return when it should be able to polyfill and should not return otherwise', () => {
    testPatternEffect<boolean>(
      (func, noError) => {
        const mockFn = jest.fn(func);
        try {
          mockFn();
        } catch (e: any) {}
        if (noError) expect(mockFn).toReturn();
        else expect(mockFn).not.toReturn();
      },
      patternTestData.map((x) => [x[0], !x[1]]),
    );
  });

  it('should return valid polyfilled seneca patterns', () => {
    testPatternEffect<PatternObject | undefined>(
      (func, pattern) => {
        const mockFn = jest.fn(func);
        try {
          mockFn();
        } catch (e: any) {}
        if (pattern === undefined) expect(mockFn).not.toReturn();
        else expect(mockFn).toReturnWith(pattern);
      },
      patternTestData.map((x) => [x[0] as Pattern, x[2] as any]),
    );
  });
});
