"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenecaStrategy = void 0;
const microservices_1 = require("@nestjs/microservices");
const seneca_1 = __importDefault(require("seneca"));
const seneca_action_failed_exception_1 = require("../models/exceptions/seneca-action-failed.exception");
const polyfill_pattern_util_1 = require("../utils/polyfill-pattern.util");
const fs_1 = require("fs");
const version_options_interface_1 = require("@nestjs/common/interfaces/version-options.interface");
const unsupported_version_exception_1 = require("../models/exceptions/unsupported-version.exception");
const respond_util_1 = require("../utils/respond.util");
/**
 * https://docs.nestjs.com/microservices/custom-transport
 * The custom transport strategy used to instantiate a Seneca instance to listen to incoming requests
 * This strategy is also used to bind controller action to certain message patterns and teardown logic
 */
class SenecaStrategy extends microservices_1.Server {
    constructor(_options) {
        var _a, _b;
        super();
        this._options = _options;
        // Initializes seneca instance used to listen to incoming messages
        // It also defines some default values
        this._senecaInstance = (0, seneca_1.default)({
            log: (_a = _options.log) !== null && _a !== void 0 ? _a : 'silent',
            timeout: _options.timeout,
            debug: _options.debug,
            errhandler: _options.errhandler,
            tag: _options.tag,
        });
        // Activates given plugins
        for (const plugin of (_b = _options.plugins) !== null && _b !== void 0 ? _b : []) {
            const { module, options } = typeof plugin === 'object'
                ? plugin
                : { module: plugin, options: undefined };
            this._senecaInstance = this._senecaInstance.use(module, options);
        }
        // if expose callback is defined, expose senecaInstance
        if (this._options.expose)
            this._senecaInstance = this._options.expose(this._senecaInstance);
    }
    /**
     * This method is called when the Nest application calls the listen() method
     * It must bind message patterns to controller actions and activate the listen mechanic for the strategy
     *
     * @param callback Called when strategy is ready to listen for incoming requests
     */
    listen(callback) {
        var _a;
        var _b;
        // Cycle through message handlers and their patterns to bind them to the Seneca ecosystem
        // These message handlers (controller actions) are gathered by NestJS through the use of the decorators. (@EventPattern() & @MessagePattern())
        for (const [patternRaw, handler] of this.messageHandlers) {
            // https://docs.nestjs.com/microservices/basics#event-based
            // Returns true if @EventPattern() decorator was used (this type of communication is not used in our microservice environment)
            if (handler.isEventHandler)
                throw new Error(`The package '${process.env.npm_package_name}' does not support event messages`);
            // Prepends required keys and autofills role & cmd keys if none was yet given
            const pattern = (0, polyfill_pattern_util_1.polyfillPattern)(patternRaw, this._options.role, this._options.cmdKey, this._options.roleKey);
            // fast lookup table for the presence of a given version
            const versionHashMap = new Set(Object.keys(handler.versions));
            // checks if current api can be used version neutrally
            const isVersionNeutral = versionHashMap.has(version_options_interface_1.VERSION_NEUTRAL.toString());
            // get the latest (VERSION_NEUTRAL is latest) version implementation in case it does not have to be selected later
            let usableVersion = Object.keys(handler.versions)[versionHashMap.size - 1];
            try {
                // https://senecajs.org/api/#method-add
                // Inserts the pattern into the Seneca ecosystem and binds it to the accompanying handler (controller action)
                this._senecaInstance.add(pattern, async (msg, reply) => {
                    var _a, _b;
                    try {
                        // get acceptable versions
                        const acceptableVersions = [
                            (_b = (_a = this.versionExtractor) === null || _a === void 0 ? void 0 : _a.call(this, msg)) !== null && _b !== void 0 ? _b : [],
                        ].flat();
                        // check if versioning is enabled & acceptable versions are present
                        if (this.versioningEnabled) {
                            // checks if one of the acceptable versions is available and thus usable
                            const acceptedVersion = acceptableVersions.find((v) => versionHashMap.has(v.toString()));
                            // if no acceptable version was available, throw unsupported api version exception
                            if (!(acceptedVersion || isVersionNeutral)) {
                                return reply((0, respond_util_1.respond)(new unsupported_version_exception_1.UnsupportedVersionException(new Error().stack)));
                            }
                            // otherwise use the accepted version it's api implementation
                            usableVersion = acceptedVersion !== null && acceptedVersion !== void 0 ? acceptedVersion : version_options_interface_1.VERSION_NEUTRAL;
                        }
                        // get the usable version controller action
                        const action = handler.versions[usableVersion.toString()];
                        // handle and reply to request on the given pattern
                        const response = await action(msg);
                        // if a specific api version was used, add the version to the response body
                        if (this.versioningEnabled && this.showApiVersion)
                            response.apiVersion = isVersionNeutral
                                ? 'neutral'
                                : Number(usableVersion);
                        // return response
                        reply(response);
                    }
                    catch (e) {
                        // if reply() threw an error, reply with SenecaActionFailedException().
                        // errors thrown in handler() are dealt with using ExceptionFilters
                        reply(new seneca_action_failed_exception_1.SenecaActionFailedException(msg.action, e.stack));
                    }
                });
            }
            catch (e) {
                throw new Error(`The given message pattern ('${pattern}') is invalid`);
            }
        }
        // Starts the seneca instance to listen for the patterns
        // It also defines some default values
        (_a = (_b = this._options.listener).type) !== null && _a !== void 0 ? _a : (_b.type = 'http');
        this._senecaInstance.listen({
            type: this._options.listener.type,
            host: this._options.listener.host.toString(),
            port: this._options.listener.port.toString(),
            serverOptions: this._options.listener.serverOptions && {
                key: (0, fs_1.readFileSync)(this._options.listener.serverOptions.key, 'utf8'),
                cert: (0, fs_1.readFileSync)(this._options.listener.serverOptions.cert, 'utf8'),
            },
        });
        // Calls the callback() method when it is ready to accept connections
        this._senecaInstance.ready(() => {
            const listenSpecs = `${this._options.listener.serverOptions ? 'TLS' : 'NON-TLS'} ${this._options.listener.type}://${this._options.listener.host}:${this._options.listener.port}`;
            this.logger[this._options.listener.serverOptions ? 'log' : 'warn'](`SenecaInstance listening on: ${listenSpecs}`);
            callback();
        });
    }
    /**
     * This method is called when the Nest application calls the close() method
     * It is responsible for the teardown logic of the strategy
     */
    close() {
        this.logger.log('Closing Seneca instance...');
        this._senecaInstance.close(() => this.logger.log('Seneca instance successfully closed'));
    }
}
exports.SenecaStrategy = SenecaStrategy;
