"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenecaApplication = void 0;
const seneca_client_service_1 = require("../services/seneca/seneca-client.service");
const seneca_version_extractor_util_1 = require("../utils/seneca-version-extractor.util");
const common_1 = require("@nestjs/common");
/**
 * This is a Nest microservice wrapper to represent the application with Seneca functionalities
 */
class SenecaApplication {
    constructor(_app) {
        this._app = _app;
        /**
         * Connects the local Seneca client to another Seneca client for communication via the act() method
         *
         * @param clients A single or list of options needed to connect to a Seneca client
         * @return this
         */
        this.connectSenecaClient = (...clients) => {
            const senecaClient = this.get(seneca_client_service_1.SenecaClient);
            for (const client of clients)
                senecaClient.connect(client);
            return this;
        };
    }
    async init() {
        await this._app.init();
        this._app.server.versioningEnabled = false;
        this._app.server.showApiVersion = false;
        return this;
    }
    async listen() {
        await this._app.listen();
        return;
    }
    async close() {
        common_1.Logger.log('Stopping Nest application...');
        await this._app.close();
        common_1.Logger.log('Nest microservice successfully stopped');
        return;
    }
    select(module) {
        return this._app.select(module);
    }
    get(typeOrToken, options) {
        return this._app.get(typeOrToken, options);
    }
    resolve(typeOrToken, contextId, options) {
        return this._app.resolve(typeOrToken, contextId, options);
    }
    useGlobalFilters(...filters) {
        this._app.useGlobalFilters(...filters);
        return this;
    }
    useGlobalGuards(...guards) {
        this._app.useGlobalGuards(...guards);
        return this;
    }
    useGlobalInterceptors(...interceptors) {
        this._app.useGlobalInterceptors(...interceptors);
        return this;
    }
    useGlobalPipes(...pipes) {
        this._app.useGlobalPipes(...pipes);
        return this;
    }
    useLogger(logger) {
        this._app.useLogger(logger);
    }
    useWebSocketAdapter(adapter) {
        this._app.useWebSocketAdapter(adapter);
        return this;
    }
    enableShutdownHooks(signals) {
        this._app.enableShutdownHooks(signals);
        return this;
    }
    registerRequestByContextId(request, contextId) {
        this._app.registerRequestByContextId(request, contextId);
    }
    flushLogs() {
        this._app.flushLogs();
    }
    enableVersioning(options) {
        var _a, _b, _c;
        // versioning will be enabled
        this._app.server.versioningEnabled = true;
        // show api version in the response object (default: true)
        this._app.server.showApiVersion = (_a = options === null || options === void 0 ? void 0 : options.showApiVersion) !== null && _a !== void 0 ? _a : true;
        // What version to default to when none was given at the api (default: VERSION_NEUTRAL)
        this._app.microservicesModule.listenersController.defaultVersion =
            (_b = options === null || options === void 0 ? void 0 : options.defaultVersion) !== null && _b !== void 0 ? _b : common_1.VERSION_NEUTRAL;
        // method which will process the incoming message and extract and return the acceptable versions from it in order
        this._app.server.versionExtractor =
            (_c = options === null || options === void 0 ? void 0 : options.extractor) !== null && _c !== void 0 ? _c : seneca_version_extractor_util_1.senecaVersionExtractor;
    }
}
exports.SenecaApplication = SenecaApplication;
