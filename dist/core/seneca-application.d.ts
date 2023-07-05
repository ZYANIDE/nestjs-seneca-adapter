import { GetOrResolveOptions } from '@nestjs/common/interfaces';
import { SenecaClientOptions } from '../models/options/seneca-client.options';
import { CustomVersioningOptions } from '@nestjs/common/interfaces/version-options.interface';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';
import { Server } from '@nestjs/microservices';
import { VersionValue } from '../models/version.types';
import { MicroservicesModule } from '@nestjs/microservices/microservices-module';
import { INestMicroservice } from '@nestjs/common/interfaces/nest-microservice.interface';
import { CanActivate, DynamicModule, ExceptionFilter, LoggerService, LogLevel, NestInterceptor, PipeTransform, ShutdownSignal, Type, WebSocketAdapter } from '@nestjs/common';
/**
 * This is a Nest microservice wrapper to represent the application with Seneca functionalities
 */
export declare class SenecaApplication implements INestMicroservice, INestApplicationContext {
    private readonly _app;
    microservicesModule: MicroservicesModule;
    server: Server;
    constructor(_app: INestMicroservice);
    init(): Promise<this>;
    listen(): Promise<void>;
    close(): Promise<void>;
    select<T>(module: Type<T> | DynamicModule): INestApplicationContext;
    get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol): TResult;
    get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, options: {
        strict?: boolean;
        each?: false | undefined;
    }): TResult;
    get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, options: {
        strict?: boolean;
        each: true;
    }): Array<TResult>;
    get<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, options?: GetOrResolveOptions): Array<TResult> | TResult;
    resolve<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol): Promise<TResult>;
    resolve<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, contextId?: {
        id: number;
    }): Promise<TResult>;
    resolve<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, contextId?: {
        id: number;
    }, options?: {
        strict?: boolean;
        each?: false | undefined;
    }): Promise<TResult>;
    resolve<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, contextId?: {
        id: number;
    }, options?: {
        strict?: boolean;
        each: true;
    }): Promise<Array<TResult>>;
    resolve<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | string | symbol, contextId?: {
        id: number;
    }, options?: GetOrResolveOptions): Promise<Array<TResult> | TResult>;
    useGlobalFilters(...filters: ExceptionFilter[]): this;
    useGlobalGuards(...guards: CanActivate[]): this;
    useGlobalInterceptors(...interceptors: NestInterceptor[]): this;
    useGlobalPipes(...pipes: PipeTransform[]): this;
    useLogger(logger: LoggerService | LogLevel[] | false): void;
    useWebSocketAdapter(adapter: WebSocketAdapter): this;
    enableShutdownHooks(signals?: ShutdownSignal[] | string[]): this;
    registerRequestByContextId<T = any>(request: T, contextId: {
        id: number;
    }): void;
    flushLogs(): void;
    enableVersioning(options?: {
        defaultVersion?: VersionValue;
        showApiVersion?: boolean;
    } & Partial<CustomVersioningOptions>): void;
    /**
     * Connects the local Seneca client to another Seneca client for communication via the act() method
     *
     * @param clients A single or list of options needed to connect to a Seneca client
     * @return this
     */
    readonly connectSenecaClient: (...clients: SenecaClientOptions[]) => this;
}
