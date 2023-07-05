"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const node_environment_enum_1 = require("../models/node-environment.enum");
const path_1 = require("path");
const fs_1 = require("fs");
/**
 * This utility can be used to have an easier time creating and managing app-settings for the Seneca Nest application microservice
 *
 * @param config Representation of all app-settings for all environments
 */
const configuration = (config) => {
    var _a, _b;
    // short function to get return an absolute path from process.cwd() if a relative one was given
    const getAbsolutePath = (path) => (0, path_1.isAbsolute)(path) ? path : (0, path_1.join)(process.cwd(), path);
    // get NODE_ENV
    const nodeEnv = process.env.NODE_ENV;
    // if string was given instead of an object representing the config, use the string as path to a config json file
    if (typeof config === 'string')
        config = JSON.parse((0, fs_1.readFileSync)(getAbsolutePath(config), { encoding: 'utf-8' }));
    if (typeof config.global === 'string')
        config.global = JSON.parse((0, fs_1.readFileSync)(getAbsolutePath(config.global), { encoding: 'utf-8' }));
    if (typeof config[nodeEnv] === 'string')
        config[nodeEnv] = JSON.parse((0, fs_1.readFileSync)(getAbsolutePath(config[nodeEnv]), {
            encoding: 'utf-8',
        }));
    // use the global settings as fallback settings and node environment specific settings as main settings
    // this is why environment specific config will overwrite the global config
    return overwriteNestedVariable((_a = config.global) !== null && _a !== void 0 ? _a : {}, (_b = config[nodeEnv]) !== null && _b !== void 0 ? _b : {});
};
exports.configuration = configuration;
/**
 * overwrite the source variable with the target variable
 * this function can handle nested objects
 *
 * @param source the subject to be overwritten
 * @param target the object that will overwrite source
 */
const overwriteNestedVariable = (source, target) => {
    var _a;
    if (typeof target !== 'object')
        return target;
    const cache = Object.assign({}, source);
    for (const key in target) {
        cache[key] = overwriteNestedVariable((_a = source[key]) !== null && _a !== void 0 ? _a : {}, target[key]);
    }
    return cache;
};
