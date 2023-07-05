import { GetOrResolveOptions } from '@nestjs/common/interfaces';
import { SenecaClientOptions } from '../models/options/seneca-client.options';
import { SenecaClient } from '../services/seneca/seneca-client.service';
import { CustomVersioningOptions } from '@nestjs/common/interfaces/version-options.interface';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';
import { senecaVersionExtractor } from '../utils/seneca-version-extractor.util';
import { Server } from '@nestjs/microservices';
import { VersionValue } from '../models/version.types';
import { MicroservicesModule } from '@nestjs/microservices/microservices-module';
import { INestMicroservice } from '@nestjs/common/interfaces/nest-microservice.interface';
import {
  CanActivate,
  DynamicModule,
  ExceptionFilter,
  Logger,
  LoggerService,
  LogLevel,
  NestInterceptor,
  PipeTransform,
  ShutdownSignal,
  Type,
  VERSION_NEUTRAL,
  WebSocketAdapter,
} from '@nestjs/common';

/**
 * This is a Nest microservice wrapper to represent the application with Seneca functionalities
 */
export class SenecaApplication
  implements INestMicroservice, INestApplicationContext
{
  microservicesModule!: MicroservicesModule;
  server!: Server;

  constructor(private readonly _app: INestMicroservice) {}

  public async init(): Promise<this> {
    await this._app.init();
    this._app.server.versioningEnabled = false;
    this._app.server.showApiVersion = false;
    return this;
  }
  public async listen(): Promise<void> {
    await this._app.listen();
    return;
  }
  public async close(): Promise<void> {
    Logger.log('Stopping Nest application...');
    await this._app.close();
    Logger.log('Nest microservice successfully stopped');
    return;
  }

  public select<T>(module: Type<T> | DynamicModule): INestApplicationContext {
    return this._app.select(module);
  }
  public get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
  ): TResult;
  public get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options: { strict?: boolean; each?: false | undefined },
  ): TResult;
  public get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options: { strict?: boolean; each: true },
  ): Array<TResult>;
  public get<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    options?: GetOrResolveOptions,
  ): Array<TResult> | TResult;
  public get(
    typeOrToken: Type,
    options?:
      | { strict?: boolean; each?: false | undefined }
      | { strict?: boolean; each: true }
      | GetOrResolveOptions,
  ): any {
    return this._app.get(typeOrToken, options);
  }
  public resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
  ): Promise<TResult>;
  public resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
  ): Promise<TResult>;
  public resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
    options?: { strict?: boolean; each?: false | undefined },
  ): Promise<TResult>;
  public resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
    options?: { strict?: boolean; each: true },
  ): Promise<Array<TResult>>;
  public resolve<TInput = any, TResult = TInput>(
    typeOrToken: Type<TInput> | string | symbol,
    contextId?: { id: number },
    options?: GetOrResolveOptions,
  ): Promise<Array<TResult> | TResult>;
  public resolve(
    typeOrToken: Type,
    contextId?: { id: number },
    options?:
      | { strict?: boolean; each?: false | undefined }
      | { strict?: boolean; each: true }
      | GetOrResolveOptions,
  ): Promise<any> {
    return this._app.resolve(typeOrToken, contextId, options);
  }

  public useGlobalFilters(...filters: ExceptionFilter[]): this {
    this._app.useGlobalFilters(...filters);
    return this;
  }
  public useGlobalGuards(...guards: CanActivate[]): this {
    this._app.useGlobalGuards(...guards);
    return this;
  }
  public useGlobalInterceptors(...interceptors: NestInterceptor[]): this {
    this._app.useGlobalInterceptors(...interceptors);
    return this;
  }
  public useGlobalPipes(...pipes: PipeTransform[]): this {
    this._app.useGlobalPipes(...pipes);
    return this;
  }
  public useLogger(logger: LoggerService | LogLevel[] | false): void {
    this._app.useLogger(logger);
  }
  public useWebSocketAdapter(adapter: WebSocketAdapter): this {
    this._app.useWebSocketAdapter(adapter);
    return this;
  }

  public enableShutdownHooks(signals?: ShutdownSignal[] | string[]): this {
    this._app.enableShutdownHooks(signals);
    return this;
  }
  public registerRequestByContextId<T = any>(
    request: T,
    contextId: { id: number },
  ): void {
    this._app.registerRequestByContextId(request, contextId);
  }
  public flushLogs(): void {
    this._app.flushLogs();
  }
  public enableVersioning(
    options?: {
      defaultVersion?: VersionValue;
      showApiVersion?: boolean;
    } & Partial<CustomVersioningOptions>,
  ) {
    // versioning will be enabled
    this._app.server.versioningEnabled = true;

    // show api version in the response object (default: true)
    this._app.server.showApiVersion = options?.showApiVersion ?? true;

    // What version to default to when none was given at the api (default: VERSION_NEUTRAL)
    this._app.microservicesModule.listenersController.defaultVersion =
      options?.defaultVersion ?? VERSION_NEUTRAL;

    // method which will process the incoming message and extract and return the acceptable versions from it in order
    this._app.server.versionExtractor =
      options?.extractor ?? senecaVersionExtractor;
  }

  /**
   * Connects the local Seneca client to another Seneca client for communication via the act() method
   *
   * @param clients A single or list of options needed to connect to a Seneca client
   * @return this
   */
  public readonly connectSenecaClient = (
    ...clients: SenecaClientOptions[]
  ): this => {
    const senecaClient = this.get(SenecaClient);
    for (const client of clients) senecaClient.connect(client);
    return this;
  };
}
