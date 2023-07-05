"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPipe = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
/**
 * A class used to cycle through all the given pipelines in order
 */
class SequentialPipe {
    constructor(_pipelines) {
        this._pipelines = _pipelines;
    }
    async transform(value, metadata) {
        for (const pipe of this._pipelines)
            value = await pipe.transform(value, metadata);
        return value;
    }
}
/**
 * This utility allows for an easier time setting up global pipelines with support for request scoped dependency injection
 *
 * @param pipelines The global pipelines
 */
const globalPipe = (...pipelines) => {
    // list of dependency injection tokens for pipelines and in which order they were given
    const diTokens = [];
    // list of ready to use pipelines and in which order they were given
    const transformPipelines = [];
    // filters dependency injection tokens of pipelines from ready to use pipelines
    pipelines.forEach((pipe, i) => {
        if (pipe instanceof Function)
            diTokens.push({ order: i, token: pipe });
        else
            transformPipelines.push({ order: i, pipe });
    });
    return {
        provide: core_1.APP_PIPE,
        scope: common_1.Scope.REQUEST,
        useFactory: (...diPipelines) => {
            // map dependency injected pipelines with their corresponding order numbers
            diPipelines = diPipelines.map((pipe, i) => ({
                order: diTokens[i].order,
                pipe,
            }));
            // give the list of pipelines to be executed in order to the sequential pipe
            return new SequentialPipe(diPipelines
                .concat(transformPipelines)
                .sort((a, b) => a.order - b.order)
                .map((x) => x.pipe));
        },
        inject: [...diTokens.map((x) => x.token)],
    };
};
exports.globalPipe = globalPipe;
