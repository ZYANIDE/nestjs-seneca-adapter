"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.polyfillPattern = void 0;
const jsonic_1 = __importDefault(require("jsonic"));
/**
 * This utility prepends required keys and autofills role if none was yet given
 *
 * @param pattern The pattern to be polyfilled
 * @param cmdKey
 * @param role The role to be added to the pattern if it is not in the pattern yet
 * @param roleKey
 */
const polyfillPattern = (pattern, role, cmdKey = 'cmd', roleKey = 'role') => {
    var _a;
    // If the pattern is undefined or null, it is an invalid pattern
    if (pattern == null)
        throw new Error('The given message pattern cannot be undefined or null');
    // If the pattern is a string it needs to be converted to an object
    if (typeof pattern === 'string') {
        try {
            pattern = (0, jsonic_1.default)(pattern);
        }
        catch (e) {
            pattern = { [cmdKey]: pattern };
        }
    }
    // if no cmd was given after processing, throw
    if (pattern[cmdKey] === undefined)
        throw new Error(`No '${cmdKey}' resulted from the given pattern`);
    // if the role was not given yet, add it
    (_a = pattern[roleKey]) !== null && _a !== void 0 ? _a : (pattern[roleKey] = role);
    // return the jsonic string of the pattern
    return jsonic_1.default.stringify(pattern);
};
exports.polyfillPattern = polyfillPattern;
