"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listeners_controller_1 = require("@nestjs/microservices/listeners-controller");
const server_1 = require("@nestjs/microservices/server");
const rpc_metadata_constants_1 = require("@nestjs/microservices/context/rpc-metadata-constants");
const constants_1 = require("@nestjs/common/constants");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_2 = require("@nestjs/core/injector/constants");
/**
 * One-to-one copy of the original implementation + tweaks for microservice api versions
 */
Reflect.defineProperty(listeners_controller_1.ListenersController.prototype, 'registerPatternHandlers', {
    value: function (instanceWrapper, server, moduleKey) {
        const { instance } = instanceWrapper;
        const isStatic = instanceWrapper.isDependencyTreeStatic();
        const patternHandlers = this.metadataExplorer.explore(instance);
        const moduleRef = this.container.getModuleByKey(moduleKey);
        const defaultCallMetadata = server instanceof server_1.ServerGrpc
            ? rpc_metadata_constants_1.DEFAULT_GRPC_CALLBACK_METADATA
            : rpc_metadata_constants_1.DEFAULT_CALLBACK_METADATA;
        patternHandlers
            .filter(({ transport }) => (0, shared_utils_1.isUndefined)(transport) ||
            (0, shared_utils_1.isUndefined)(server.transportId) ||
            transport === server.transportId)
            .reduce((acc, handler) => {
            let _a;
            (_a = handler.patterns) === null || _a === void 0
                ? void 0
                : _a.forEach((pattern) => acc.push(Object.assign(Object.assign({}, handler), {
                    patterns: [pattern],
                })));
            return acc;
        }, [])
            .forEach((definition) => {
            var _b;
            const { patterns: [pattern], targetCallback, methodKey, extras, isEventHandler, } = definition;
            // fetch the available versions for the current handler and if none are given, use the defaultVersion
            const versions = (_b = Reflect.getMetadata(constants_1.VERSION_METADATA, targetCallback)) !== null && _b !== void 0 ? _b : this.defaultVersion;
            if (Array.isArray(versions) && versions.length <= 0)
                versions.push(this.defaultVersion);
            this.insertEntrypointDefinition(instanceWrapper, definition, server.transportId);
            if (isStatic) {
                const proxy = this.contextCreator.create(instance, targetCallback, moduleKey, methodKey, constants_2.STATIC_CONTEXT, undefined, defaultCallMetadata);
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
                }
                else {
                    return server.addHandler(pattern, proxy, isEventHandler, extras, versions);
                }
            }
            const asyncHandler = this.createRequestScopedHandler(instanceWrapper, pattern, moduleRef, moduleKey, methodKey, defaultCallMetadata, isEventHandler);
            server.addHandler(pattern, asyncHandler, isEventHandler, extras, versions);
        });
    },
});
