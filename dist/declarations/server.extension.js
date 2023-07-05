"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const microservices_1 = require("@nestjs/microservices");
/**
 * One-to-one copy of the original implementation + tweaks for microservice api versions
 */
Reflect.defineProperty(microservices_1.Server.prototype, 'addHandler', {
    value: function (pattern, callback, // eslint-disable-line
    isEventHandler = false, extras = {}, versions = []) {
        var _a;
        const normalizedPattern = this.normalizePattern(pattern);
        const handler = {
            isEventHandler,
            extras,
            versions: [versions].flat().reduce((acc, v) => {
                acc[v.toString()] = callback;
                return acc;
            }, {}),
        };
        // since @EventPattern() isn't supported it is commented out here
        // if (this.messageHandlers.has(normalizedPattern) && isEventHandler) {
        //   const headRef = this.messageHandlers.get(normalizedPattern);
        //   const getTail: any = (handler: MessageHandler) => (handler === null || handler === void 0 ? void 0 : handler.next) ? getTail(handler.next) : handler;
        //   const tailRef = getTail(headRef);
        //   tailRef.next = callback;
        // }
        Object.assign(handler.versions, (_a = this.messageHandlers.get(normalizedPattern)) === null || _a === void 0 ? void 0 : _a.versions);
        this.messageHandlers.set(normalizedPattern, handler);
    },
});
