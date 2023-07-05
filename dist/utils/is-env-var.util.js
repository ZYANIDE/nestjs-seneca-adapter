"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnvVar = void 0;
/**
 * This utility function is meant to check if a given environment variable is meant to be false or true
 *
 * @param key the environment variable name
 * @param expect whether true or false is expected
 */
const isEnvVar = (key, expect = true) => {
    const value = process.env[key];
    const truthy = value !== 'false' && value !== '0' && !!value;
    return truthy == expect;
};
exports.isEnvVar = isEnvVar;
