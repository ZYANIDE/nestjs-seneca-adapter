import { INestApplicationContext, Logger, Type } from '@nestjs/common';
import { GetOrResolveOptions } from '@nestjs/common/interfaces';
import { INestMicroservice } from '@nestjs/common/interfaces/nest-microservice.interface';
import { AppSettings } from '../../src/services/app-settings/app-settings.service';
import { SenecaClient } from '../../src/services/seneca/seneca-client.service';
import { LoggerServiceMock } from './logger.service.mock';
import { SenecaClientMock } from './seneca-client.service.mock';
import { SettingsMock } from './settings.service.mock';
import { Server } from '@nestjs/microservices';
import { MicroservicesModule } from '@nestjs/microservices/microservices-module';

export class NestMicroserviceMock implements INestMicroservice {
  server: Server = {} as Server;
  microservicesModule: MicroservicesModule = {} as MicroservicesModule;
  private readonly _diCollection: Record<string, any> = {};
  public readonly loggerServiceMock = new LoggerServiceMock();
  public readonly senecaClientMock = new SenecaClientMock();
  public readonly settingsMock = new SettingsMock();

  async init(): Promise<this> {
    return this;
  }
  async listen(): Promise<any> {
    return;
  }
  async close(): Promise<void> {
    return;
  }

  select(): INestApplicationContext {
    return {} as INestApplicationContext;
  }
  get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
  ): TResult;
  get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options: { strict?: boolean; each?: false | undefined },
  ): TResult;
  get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options: { strict?: boolean; each: true },
  ): Array<TResult>;
  get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options?: GetOrResolveOptions,
  ): Array<TResult> | TResult;
  get(typeOrToken: Type): any {
    switch (typeOrToken) {
      case Logger:
        return this.loggerServiceMock;
      case SenecaClient:
        return this.senecaClientMock;
      case AppSettings:
        return this.settingsMock;
      default:
        return this._diCollection[typeOrToken?.toString()] ?? {};
    }
  }
  resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
  ): Promise<TResult>;
  resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
  ): Promise<TResult>;
  resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
    options?: { strict?: boolean; each?: false | undefined },
  ): Promise<TResult>;
  resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
    options?: { strict?: boolean; each: true },
  ): Promise<Array<TResult>>;
  resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
    options?: GetOrResolveOptions,
  ): Promise<Array<TResult> | TResult>;
  async resolve(typeOrToken: Type): Promise<any> {
    return this.get(typeOrToken);
  }

  useGlobalFilters(): this {
    return this;
  }
  useGlobalGuards(): this {
    return this;
  }
  useGlobalInterceptors(): this {
    return this;
  }
  useGlobalPipes(): this {
    return this;
  }
  useLogger(): void {
    /* do nothing */
  }
  useWebSocketAdapter(): this {
    return this;
  }

  enableShutdownHooks(): this {
    return this;
  }
  registerRequestByContextId(): void {
    /* do nothing */
  }
  flushLogs(): void {
    /* do nothing */
  }

  public insertDependencyInjection(provider: Type, value?: any) {
    this._diCollection[provider.toString()] = value ?? new provider();
  }
}
