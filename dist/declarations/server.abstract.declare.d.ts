declare module '@nestjs/microservices' {
    import { IGenericClientRequest } from 'nestjs-seneca-adapter';
    import { LoggerService } from '@nestjs/common';
    import { Observable, ObservedValueOf, Subscription } from 'rxjs';
    import { VersionValue } from '@nestjs/common/interfaces/version-options.interface';
    import 'reflect-metadata';
    export * from '@nestjs/microservices/client';
    export * from '@nestjs/microservices/ctx-host';
    export * from '@nestjs/microservices/decorators';
    export * from '@nestjs/microservices/enums';
    export * from '@nestjs/microservices/exceptions';
    export * from '@nestjs/microservices/helpers';
    export * from '@nestjs/microservices/interfaces';
    export * from '@nestjs/microservices/module';
    export * from '@nestjs/microservices/nest-microservice';
    export * from '@nestjs/microservices/record-builders';
    export * from '@nestjs/microservices/server';
    export * from '@nestjs/microservices/tokens';
    import { ConsumerSerializer, ConsumerDeserializer, MsPattern, ClientOptions, MicroserviceOptions, BaseRpcContext, ReadPacket, WritePacket } from '@nestjs/microservices';
    export abstract class Server {
        versioningEnabled: boolean;
        showApiVersion: boolean;
        versionExtractor?: <TRequest extends IGenericClientRequest<unknown>>(request: TRequest) => VersionValue;
        protected readonly messageHandlers: Map<string, MessageHandler<any, any, any>>;
        protected readonly logger: LoggerService;
        protected serializer: ConsumerSerializer;
        protected deserializer: ConsumerDeserializer;
        addHandler(pattern: any, callback: MessageHandler, isEventHandler?: boolean, extras?: Record<string, any>, versions?: VersionValue): void;
        getHandlers(): Map<string, MessageHandler>;
        getHandlerByPattern(pattern: string): MessageHandler | null;
        send(stream$: Observable<any>, respond: (data: WritePacket) => unknown | Promise<unknown>): Subscription;
        handleEvent(pattern: string, packet: ReadPacket, context: BaseRpcContext): Promise<any>;
        transformToObservable<T>(resultOrDeferred: Observable<T> | Promise<T>): Observable<T>;
        transformToObservable<T>(resultOrDeferred: T): never extends Observable<ObservedValueOf<T>> ? Observable<T> : Observable<ObservedValueOf<T>>;
        getOptionsProp<T extends MicroserviceOptions['options'], K extends keyof T>(obj: T, prop: K, defaultValue?: T[K]): T[K];
        protected handleError(error: string): void;
        protected loadPackage<T = any>(name: string, ctx: string, loader?: Function): T;
        protected initializeSerializer(options: ClientOptions['options']): void;
        protected initializeDeserializer(options: ClientOptions['options']): void;
        /**
         * Transforms the server Pattern to valid type and returns a route for him.
         *
         * @param  {string} pattern - server pattern
         * @returns string
         */
        protected getRouteFromPattern(pattern: string): string;
        protected normalizePattern(pattern: MsPattern): string;
    }
}
