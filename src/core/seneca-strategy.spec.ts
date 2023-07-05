import { SenecaStrategyOptions } from '../models/options/seneca-strategy.options';
import { default as Seneca } from 'seneca';
import { SenecaStrategy as SS } from './seneca-strategy';
import { SenecaInstanceMock } from '../../test/mockups/seneca-instance.mock';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { LoggerServiceMock } from '../../test/mockups/logger.service.mock';
import { Type } from '@nestjs/common';
import { Pattern, PatternObject, PatternString } from '../models/seneca.types';
import jsonic from 'jsonic';
import { VERSION_NEUTRAL } from '@nestjs/common/interfaces/version-options.interface';
import '../declarations/message-handler.interface.declare';
import { MessageHandler } from '@nestjs/microservices';

type MessageHandlerCollection = Map<string, MessageHandler<any, any, any>>;

class SenecaStrategy extends SS {
  public _senecaInstance!: Seneca.Instance;
  public messageHandlers!: MessageHandlerCollection;
  public logger!: LoggerService;
}

describe('SenecaStrategy', () => {
  const DEFAULT_ROLE = 'DEFAULT_ROLE';
  const completeSettings: SenecaStrategyOptions = {
    listener: { port: 10101, host: 'localhost' },
    role: DEFAULT_ROLE,
  };
  let strategy: SenecaStrategy;

  beforeEach(() => {
    strategy = new SenecaStrategy(completeSettings);
    strategy._senecaInstance = new SenecaInstanceMock();
    strategy.logger = new LoggerServiceMock();
  });
  afterEach(() =>
    strategy._senecaInstance.close(() => {
      /* do nothing */
    }),
  );

  it('should initialize senecaInstance successful at initialization', () => {
    strategy = new SenecaStrategy(completeSettings);
    expect(strategy._senecaInstance).toBeDefined();
  });

  it('should should make senecaInstance listen when listen() is called', () => {
    const spy = jest.spyOn(strategy._senecaInstance, 'listen');
    strategy.listen(() => {
      /* do nothing */
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should close senecaInstance when close() is called', () => {
    const spy = jest.spyOn(strategy._senecaInstance, 'close');
    strategy.close();

    expect(spy).toHaveBeenCalled();
  });

  it('should callback on listen() when senecaInstance is ready', () => {
    const spy = jest.spyOn(strategy._senecaInstance, 'ready');
    strategy.listen(() => expect(spy).toHaveBeenCalled());
  });

  const testPatternEffect = <T>(
    expectFn: (func: () => void, value: T) => void,
    testData: [patternIn: any, value: T][],
  ) => {
    for (const [patternIn, value] of testData) {
      const func = () =>
        strategy.listen(() => {
          /* do nothing */
        });
      strategy.messageHandlers = new Map([
        [
          patternIn,
          {
            next: () => {
              /* do nothing */
            },
            isEventHandler: false,
            extras: {},
            versions: {
              [VERSION_NEUTRAL.toString()]: () => {
                /* do nothing */
              },
            },
          } as any,
        ],
      ]);

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

  it('should not throw when binding processable messageHandler to senecaInstance', () => {
    testPatternEffect<Type<Error> | undefined>(
      (func, error) => {
        if (error === undefined) expect(func).not.toThrow();
        else expect(func).toThrow(error);
      },
      patternTestData.map((x) => [x[0], x[1]]),
    );
  });

  it('should attempt binding messageHandlers to senecaInstance when valid', () => {
    const spy = jest.spyOn(strategy._senecaInstance, 'add');
    testPatternEffect<boolean>(
      (func, throwsError) => {
        try {
          func();
        } catch (e: any) {}
        if (!throwsError) expect(spy).toHaveBeenCalled();
        else expect(spy).not.toHaveBeenCalled();
        spy.mockClear();
      },
      patternTestData.map((x) => [x[0], !!x[1]]),
    );
  });

  it('should transform incoming patterns to processable ones for seneca', () => {
    const spy = jest.spyOn(strategy._senecaInstance, 'add');
    testPatternEffect<PatternObject | undefined>(
      (func, pattern) => {
        try {
          func();
        } catch (e: any) {}
        if (pattern === undefined) expect(spy).not.toHaveBeenCalled();
        else expect(spy).toHaveBeenCalledWith(pattern, expect.anything());
        spy.mockClear();
      },
      patternTestData.map((x) => [x[0] as Pattern, x[2] as any]),
    );
  });
});
