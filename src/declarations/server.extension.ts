import { Server } from '@nestjs/microservices';
import { MessageHandler } from '@nestjs/microservices';
import { VersionValue } from '@nestjs/common/interfaces/version-options.interface';

/**
 * One-to-one copy of the original implementation + tweaks for microservice api versions
 */
Reflect.defineProperty(Server.prototype, 'addHandler', {
  value: function (
    pattern: string,
    callback: Function, // eslint-disable-line
    isEventHandler = false,
    extras = {},
    versions: VersionValue = [],
  ) {
    const normalizedPattern = this.normalizePattern(pattern);
    const handler: MessageHandler = {
      isEventHandler,
      extras,
      versions: [versions].flat().reduce((acc: any, v) => {
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

    Object.assign(
      handler.versions,
      this.messageHandlers.get(normalizedPattern)?.versions,
    );
    this.messageHandlers.set(normalizedPattern, handler);
  },
});
