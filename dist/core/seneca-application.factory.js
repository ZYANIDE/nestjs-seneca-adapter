"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenecaApplicationFactory = void 0;
const seneca_application_1 = require("./seneca-application");
const core_1 = require("@nestjs/core");
const seneca_strategy_1 = require("./seneca-strategy");
const root_module_1 = require("./root.module");
const node_environment_enum_1 = require("../models/node-environment.enum");
const is_env_var_util_1 = require("../utils/is-env-var.util");
const common_1 = require("@nestjs/common");
/**
 * A factory function for the Seneca application
 *
 * @param module Entrypoint module of the application
 * @param options App app-settings that will be used to initialize the application
 * @constructor
 */
const SenecaApplicationFactory = async (module, options) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Check if all required app app-settings are given
    if (!options.seneca.listener.host || !options.seneca.listener.port)
        throw new Error('Required config properties are not defined');
    // Get node environment
    const nodeEnv = process.env.NODE_ENV;
    // Initialize a Nest application microservice to be a base for the SenecaApplication which will wrap around it so functionalities written by Nest won't have to be reinvented
    const app = (await core_1.NestFactory.createMicroservice(root_module_1.RootModule.register(module, options), {
        strategy: new seneca_strategy_1.SenecaStrategy(options.seneca),
        logger: (_a = options.logger) !== null && _a !== void 0 ? _a : ['error', 'warn', 'log'],
        abortOnError: (_b = options.abortOnError) !== null && _b !== void 0 ? _b : true,
        bufferLogs: (_c = options.bufferLogs) !== null && _c !== void 0 ? _c : false,
        autoFlushLogs: (_d = options.autoFlushLogs) !== null && _d !== void 0 ? _d : true,
        preview: (_e = options.preview) !== null && _e !== void 0 ? _e : false,
        snapshot: (_f = options.snapshot) !== null && _f !== void 0 ? _f : false,
    }));
    // Show the value of node environment and if it is not recognized as a predefined one, give a warning
    if (!Object.keys(node_environment_enum_1.NodeEnvironment).includes(nodeEnv))
        common_1.Logger.warn(`Environment variable 'NODE_ENV' ('${nodeEnv}') not recognized`);
    else
        common_1.Logger[nodeEnv === node_environment_enum_1.NodeEnvironment.prod ? 'log' : 'warn'](`Environment variable 'NODE_ENV' ('${nodeEnv}') has been set`);
    // Give a warning if the VERBOSE flag has been set
    if ((0, is_env_var_util_1.isEnvVar)('VERBOSE'))
        common_1.Logger.warn(`Environment variable 'VERBOSE' flag has been set`);
    // Show an indication if the NO_COLOR flag has been set
    if ((0, is_env_var_util_1.isEnvVar)('NO_COLOR'))
        common_1.Logger.log(`Environment variable 'NO_COLOR' flag has been set`);
    // Show how many seneca clients have been found in the app app-settings
    const clientCount = (_h = (_g = options.seneca.clients) === null || _g === void 0 ? void 0 : _g.length) !== null && _h !== void 0 ? _h : 0;
    common_1.Logger.log(`Found ${clientCount} seneca client${clientCount !== 1 ? 's' : ''} during initialization`);
    // Initialize the wrapper and return after connecting to the given Seneca clients
    return new seneca_application_1.SenecaApplication(app).connectSenecaClient(...((_j = options.seneca.clients) !== null && _j !== void 0 ? _j : []));
};
exports.SenecaApplicationFactory = SenecaApplicationFactory;
