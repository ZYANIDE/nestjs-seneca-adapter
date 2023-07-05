import { SenecaClient as SC } from './seneca-client.service';
import { SettingsMock } from '../../../test/mockups/settings.service.mock';
import { Instance as SenecaInstance } from 'seneca';
import { SenecaClientOptions } from '../../models/options/seneca-client.options';
import { SenecaInstanceMock } from '../../../test/mockups/seneca-instance.mock';
import { Pattern } from '../../models/seneca.types';
import { Logger } from '@nestjs/common';

class SenecaClient extends SC {
  public readonly _senecaInstance!: SenecaInstance;
}

describe('SenecaClient', () => {
  let senecaClient: SenecaClient;

  beforeAll(() => {
    jest.spyOn(Logger, 'log').mockImplementation(() => {
      /* do nothing */
    });
  });

  beforeEach(() => {
    senecaClient = new SenecaClient(new SettingsMock());
  });

  afterEach(() => {
    senecaClient._senecaInstance.close(() => {
      /* do nothing */
    });
  });

  it('should be defined', () => {
    expect(senecaClient).toBeDefined();
  });

  it('should attempt to connect to a client on connect()', () => {
    const spy = jest.spyOn(senecaClient._senecaInstance, 'client');
    senecaClient.connect({} as SenecaClientOptions);
    expect(spy).toHaveBeenCalled();
  });

  const testPassedConnectArg = (
    prop: keyof SenecaClientOptions,
    value: any,
  ) => {
    it(`should pass arg ${prop} to connect to inner Seneca instance on connect()`, () => {
      let passedOptions: any;
      const options: SenecaClientOptions = {
        [prop]: value,
      } as SenecaClientOptions;
      jest
        .spyOn(senecaClient._senecaInstance, 'client')
        .mockImplementation((opts: any) => {
          passedOptions = opts;
          return new SenecaInstanceMock();
        });

      senecaClient.connect(options);
      expect(options[prop]).toBe(passedOptions?.[prop]);
    });
  };

  testPassedConnectArg('type', 'smtp');
  testPassedConnectArg('port', 10101);
  testPassedConnectArg('host', 'mock.localhost');
  testPassedConnectArg('pin', 'lorem_ipsum');

  it('should be a wrapper for act()', () => {
    const data: any = {};
    const spy = jest
      .spyOn(senecaClient._senecaInstance, 'act')
      .mockImplementation(() => {
        /* do nothing */
      });
    senecaClient.act('pattern', data);
    expect(spy).toHaveBeenCalled();
  });

  it('should pass all its args to inner act()', () => {
    const args: [Pattern, object | undefined] = ['pattern', {}];
    const spy = jest
      .spyOn(senecaClient._senecaInstance, 'act')
      .mockImplementation(() => {
        /* do nothing */
      });
    senecaClient.act(...args);
    expect(spy).toHaveBeenCalledWith(...args, expect.anything());
  });

  it('should close inner Seneca instance on module deconstruction', () => {
    const spy = jest.spyOn(senecaClient._senecaInstance, 'close');
    senecaClient.onModuleDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should initialize seneca instance on initialization', () => {
    expect(senecaClient._senecaInstance).toBeDefined();
  });
});
