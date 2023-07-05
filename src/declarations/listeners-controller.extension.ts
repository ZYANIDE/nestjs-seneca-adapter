import { ListenersController } from '@nestjs/microservices/listeners-controller';
import { ServerGrpc } from '@nestjs/microservices/server';
import {
  DEFAULT_CALLBACK_METADATA,
  DEFAULT_GRPC_CALLBACK_METADATA,
} from '@nestjs/microservices/context/rpc-metadata-constants';
import { VERSION_METADATA } from '@nestjs/common/constants';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Controller } from '@nestjs/common/interfaces/controllers/controller.interface';
import { Injectable } from '@nestjs/common/interfaces';
import { Server } from '@nestjs/microservices';
import { CustomTransportStrategy } from '@nestjs/microservices/interfaces';
import { EventOrMessageListenerDefinition } from '@nestjs/microservices/listener-metadata-explorer';
import { Module } from '@nestjs/core/injector/module';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { VersionValue } from '@nestjs/common/interfaces/version-options.interface';

/**
 * One-to-one copy of the original implementation + tweaks for microservice api versions
 */
Reflect.defineProperty(
  ListenersController.prototype,
  'registerPatternHandlers',
  {
    value: function (
      instanceWrapper: InstanceWrapper<Controller | Injectable>,
      server: Server & CustomTransportStrategy,
      moduleKey: string,
    ) {
      const { instance } = instanceWrapper;
      const isStatic = instanceWrapper.isDependencyTreeStatic();
      const patternHandlers: EventOrMessageListenerDefinition[] =
        this.metadataExplorer.explore(instance);
      const moduleRef: Module = this.container.getModuleByKey(moduleKey);
      const defaultCallMetadata =
        server instanceof ServerGrpc
          ? DEFAULT_GRPC_CALLBACK_METADATA
          : DEFAULT_CALLBACK_METADATA;

      patternHandlers
        .filter(
          ({ transport }) =>
            isUndefined(transport) ||
            isUndefined(server.transportId) ||
            transport === server.transportId,
        )
        .reduce((acc: any[], handler: EventOrMessageListenerDefinition) => {
          let _a;
          (_a = handler.patterns) === null || _a === void 0
            ? void 0
            : _a.forEach((pattern) =>
                acc.push(
                  Object.assign(Object.assign({}, handler), {
                    patterns: [pattern],
                  }),
                ),
              );
          return acc;
        }, [])
        .forEach((definition) => {
          const {
            patterns: [pattern],
            targetCallback,
            methodKey,
            extras,
            isEventHandler,
          } = definition;

          // fetch the available versions for the current handler and if none are given, use the defaultVersion
          const versions: VersionValue =
            Reflect.getMetadata(VERSION_METADATA, targetCallback) ??
            this.defaultVersion;
          if (Array.isArray(versions) && versions.length <= 0)
            versions.push(this.defaultVersion);

          this.insertEntrypointDefinition(
            instanceWrapper,
            definition,
            server.transportId,
          );
          if (isStatic) {
            const proxy = this.contextCreator.create(
              instance,
              targetCallback,
              moduleKey,
              methodKey,
              STATIC_CONTEXT,
              undefined,
              defaultCallMetadata,
            );
            if (isEventHandler) {
              // since @EventPattern() isn't supported it is commented out here
              // const eventHandler = async (...args: any[]) => {
              //   const originalArgs = args;
              //   const [dataOrContextHost] = originalArgs;
              //   if (dataOrContextHost instanceof RequestContextHost) {
              //     args = args.slice(1, args.length);
              //   }
              //   const returnValue = proxy(...args);
              //   return this.forkJoinHandlersIfAttached(returnValue, originalArgs, eventHandler);
              // };
              // return server.addHandler(pattern, eventHandler, isEventHandler, extras, versions);
              return;
            } else {
              return server.addHandler(
                pattern,
                proxy,
                isEventHandler,
                extras,
                versions,
              );
            }
          }
          const asyncHandler = this.createRequestScopedHandler(
            instanceWrapper,
            pattern,
            moduleRef,
            moduleKey,
            methodKey,
            defaultCallMetadata,
            isEventHandler,
          );
          server.addHandler(
            pattern,
            asyncHandler,
            isEventHandler,
            extras,
            versions,
          );
        });
    },
  },
);
