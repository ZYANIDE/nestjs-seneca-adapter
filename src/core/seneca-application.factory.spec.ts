import { SenecaApplicationFactory } from './seneca-application.factory';
import { EmptyModule } from '../../test/mockups/empty.module';
import { SenecaApplication } from './seneca-application';
import { NestMicroserviceMock } from '../../test/mockups/nest-microservice.mock';
import { NestFactory } from '@nestjs/core';
import SpyInstance = jest.SpyInstance;
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { CustomStrategy } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { SenecaStrategy } from './seneca-strategy';
import { Logger } from '@nestjs/common';

describe('SenecaApplicationFactory', () => {
  let senecaClientConnectSpy: SpyInstance;
  let appSettingsSnapshot:
    | (NestMicroserviceOptions & CustomStrategy)
    | undefined;
  let missingHostFactory: Promise<SenecaApplication>;
  let missingPortFactory: Promise<SenecaApplication>;
  let completeFactory: Promise<SenecaApplication>;
  const setupSpies = () => {
    const nestMicroserviceMock = new NestMicroserviceMock();
    appSettingsSnapshot = undefined;
    senecaClientConnectSpy = jest.spyOn(
      nestMicroserviceMock.senecaClientMock,
      'connect',
    );
    jest
      .spyOn(NestFactory, 'createMicroservice')
      .mockImplementation((module: any, settings: any) => {
        appSettingsSnapshot = settings;
        return Promise.resolve(nestMicroserviceMock);
      });
  };

  beforeAll(() => {
    jest.spyOn(Logger, 'log').mockImplementation(() => {
      /* do nothing */
    });
    jest.spyOn(Logger, 'warn').mockImplementation(() => {
      /* do nothing */
    });
    jest.spyOn(Logger, 'error').mockImplementation(() => {
      /* do nothing */
    });

    setupSpies();
    missingHostFactory = SenecaApplicationFactory(EmptyModule, {
      seneca: { listener: { port: 10101 } },
    } as any);
    missingPortFactory = SenecaApplicationFactory(EmptyModule, {
      seneca: { listener: { host: 'localhost' } },
    } as any);
    completeFactory = SenecaApplicationFactory(EmptyModule, {
      seneca: { listener: { port: 10101, host: 'localhost' } },
    });
  });
  beforeEach(setupSpies);

  it('should throw error if minimum required app-settings was not met (missing host)', async () => {
    await expect(missingHostFactory).rejects.toThrow();
  });

  it('should throw error if minimum required app-settings was not met (missing port)', async () => {
    await expect(missingPortFactory).rejects.toThrow();
  });

  it('should throw error if minimum required app-settings was not met (nothing is missing)', async () => {
    await expect(completeFactory).resolves.not.toThrow();
  });

  it('should return SenecaApplication when successful (missing host)', async () => {
    await expect(missingHostFactory).rejects.toThrow();
  });

  it('should return SenecaApplication when successful (missing port)', async () => {
    await expect(missingPortFactory).rejects.toThrow();
  });

  it('should return SenecaApplication when successful (nothing is missing)', async () => {
    await expect(completeFactory).resolves.toBeInstanceOf(SenecaApplication);
  });

  const testConnectSenecaClientAttempt = async (clientCount: number) => {
    const clients = Array(clientCount)
      .fill({})
      .map((_, id) => ({ port: id, host: 'localhost' }));
    await SenecaApplicationFactory(EmptyModule, {
      seneca: {
        listener: { port: 10101, host: 'localhost' },
        clients,
      },
    });

    expect(senecaClientConnectSpy).toHaveBeenCalledTimes(clientCount);
    for (let n = 0; n < clientCount; n++)
      expect(senecaClientConnectSpy).toHaveBeenNthCalledWith(n + 1, clients[n]);
  };

  it('should auto-connect to clients given in the app-settings (0 clients)', async () => {
    await testConnectSenecaClientAttempt(0);
  });

  it('should auto-connect to clients given in the app-settings (1 client)', async () => {
    await testConnectSenecaClientAttempt(1);
  });

  it('should auto-connect to clients given in the app-settings (2 clients)', async () => {
    await testConnectSenecaClientAttempt(2);
  });

  it('should auto-connect to clients given in the app-settings (100 clients)', async () => {
    await testConnectSenecaClientAttempt(100);
  });

  it('should give innerApp the SenecaStrategy', async () => {
    await SenecaApplicationFactory(EmptyModule, {
      seneca: { listener: { port: 10101, host: 'localhost' } },
    });
    expect(appSettingsSnapshot?.strategy).toBeInstanceOf(SenecaStrategy);
  });
});
