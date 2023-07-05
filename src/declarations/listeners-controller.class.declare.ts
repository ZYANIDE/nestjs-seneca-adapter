declare module '@nestjs/microservices/listeners-controller' {
  import { ClientsContainer } from '@nestjs/microservices/container';
  import { RpcContextCreator } from '@nestjs/microservices/context/rpc-context-creator';
  import { NestContainer } from '@nestjs/core/injector/container';
  import { Injector } from '@nestjs/core/injector/injector';
  import { IClientProxyFactory } from '@nestjs/microservices/client/client-proxy-factory';
  import { ExceptionFiltersContext } from '@nestjs/microservices/context/exception-filters-context';
  import { GraphInspector } from '@nestjs/core/inspector/graph-inspector';
  import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
  import { Controller } from '@nestjs/common/interfaces/controllers/controller.interface';
  import { Injectable } from '@nestjs/common/interfaces';
  import { Server } from '@nestjs/microservices/server/server';
  import {
    CustomTransportStrategy,
    MessageHandler,
    PatternMetadata,
  } from '@nestjs/microservices/interfaces';
  import { EventOrMessageListenerDefinition } from '@nestjs/microservices/listener-metadata-explorer';
  import { Transport } from '@nestjs/microservices/enums';
  import { Observable, ObservedValueOf } from 'rxjs';
  import { Module } from '@nestjs/core/injector/module';
  import { VersionValue } from '@nestjs/common/interfaces/version-options.interface';

  export class ListenersController {
    // added defaultVersion prop
    defaultVersion?: VersionValue;

    private readonly clientsContainer;
    private readonly contextCreator;
    private readonly container;
    private readonly injector;
    private readonly clientFactory;
    private readonly exceptionFiltersContext;
    private readonly graphInspector;
    private readonly metadataExplorer;
    private readonly exceptionFiltersCache;
    constructor(
      clientsContainer: ClientsContainer,
      contextCreator: RpcContextCreator,
      container: NestContainer,
      injector: Injector,
      clientFactory: IClientProxyFactory,
      exceptionFiltersContext: ExceptionFiltersContext,
      graphInspector: GraphInspector,
    );
    registerPatternHandlers(
      instanceWrapper: InstanceWrapper<Controller | Injectable>,
      server: Server & CustomTransportStrategy,
      moduleKey: string,
    ): void;
    insertEntrypointDefinition(
      instanceWrapper: InstanceWrapper,
      definition: EventOrMessageListenerDefinition,
      transportId: Transport | symbol,
    ): void;
    forkJoinHandlersIfAttached(
      currentReturnValue: Promise<unknown> | Observable<unknown>,
      originalArgs: unknown[],
      handlerRef: MessageHandler,
    ): Observable<unknown> | Promise<unknown>;
    assignClientsToProperties(instance: Controller | Injectable): void;
    assignClientToInstance<T = any>(
      instance: Controller | Injectable,
      property: string,
      client: T,
    ): void;
    createRequestScopedHandler(
      wrapper: InstanceWrapper,
      pattern: PatternMetadata,
      moduleRef: Module,
      moduleKey: string,
      methodKey: string,
      defaultCallMetadata?: Record<string, any>,
      isEventHandler?: boolean,
    ): MessageHandler<any, any, any>;
    private getContextId;
    transformToObservable<T>(
      resultOrDeferred: Observable<T> | Promise<T>,
    ): Observable<T>;
    transformToObservable<T>(
      resultOrDeferred: T,
    ): never extends Observable<ObservedValueOf<T>>
      ? Observable<T>
      : Observable<ObservedValueOf<T>>;
  }
}
