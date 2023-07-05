import { SenecaApplication } from './seneca-application';
import { INestMicroservice, Logger } from '@nestjs/common';
import { NestMicroserviceMock } from '../../test/mockups/nest-microservice.mock';

describe('SenecaApplication', () => {
  let innerApp: NestMicroserviceMock;
  let app: SenecaApplication;

  beforeAll(() => {
    jest.spyOn(Logger, 'log').mockImplementation(() => {
      /* do nothing */
    });
  });
  beforeEach(() => {
    innerApp = new NestMicroserviceMock();
    app = new SenecaApplication(innerApp);
  });
  afterEach(() => {
    app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  const testWrapperFunction = (
    methodName: keyof INestMicroservice,
    returnValue: () => any,
  ) => {
    it(`should be a wrapper for ${methodName}()`, async () => {
      const spy = jest.spyOn(innerApp, methodName as any);

      const returnee = (app[methodName] as () => Promise<void>)();
      if (returnee instanceof Promise) await returnee;

      expect(spy).toHaveBeenCalled();
    });

    it(`should return '${
      returnValue() ?? 'void'
    }' when ${methodName}() is called`, async () => {
      let value = (app[methodName] as () => Promise<any>)();
      if (value instanceof Promise) value = await value;

      if (typeof value === 'object') expect(value).toEqual(returnValue());
      else expect(value).toBe(returnValue());
    });
  };

  testWrapperFunction('init', () => app);
  testWrapperFunction('listen', () => undefined);
  testWrapperFunction('close', () => undefined);
  testWrapperFunction('select', () => ({}));
  testWrapperFunction('get', () => ({}));
  testWrapperFunction('resolve', () => ({}));
  testWrapperFunction('useGlobalFilters', () => app);
  testWrapperFunction('useGlobalGuards', () => app);
  testWrapperFunction('useGlobalInterceptors', () => app);
  testWrapperFunction('useGlobalPipes', () => app);
  testWrapperFunction('useLogger', () => undefined);
  testWrapperFunction('useWebSocketAdapter', () => app);
  testWrapperFunction('enableShutdownHooks', () => app);
  testWrapperFunction('registerRequestByContextId', () => undefined);
  testWrapperFunction('flushLogs', () => undefined);

  const testConnectSenecaClientAttempt = (clientCount: number) => {
    const spy = jest.spyOn(innerApp.senecaClientMock, 'connect');

    const clients = Array(clientCount)
      .fill({})
      .map((_, id) => ({ port: id, host: 'localhost' }));
    app.connectSenecaClient(...clients);
    expect(spy).toHaveBeenCalledTimes(clientCount);
    for (let n = 0; n < clientCount; n++)
      expect(spy).toHaveBeenNthCalledWith(n + 1, clients[n]);
  };

  it('should attempt to connect to Seneca clients when connectSenecaClient() is called with 0 clients', () => {
    testConnectSenecaClientAttempt(0);
  });

  it('should attempt to connect to Seneca clients when connectSenecaClient() is called with 1 clients', () => {
    testConnectSenecaClientAttempt(1);
  });

  it('should attempt to connect to Seneca clients when connectSenecaClient() is called with 2 clients', () => {
    testConnectSenecaClientAttempt(2);
  });

  it('should attempt to connect to Seneca clients when connectSenecaClient() is called with 100 clients', () => {
    testConnectSenecaClientAttempt(100);
  });
});
