import {
  CustomTransportStrategy,
  MessageHandler,
  Server,
} from '@nestjs/microservices';
import { default as Seneca } from 'seneca';
import { SenecaStrategyOptions } from '../models/options/seneca-strategy.options';
import { SenecaActionFailedException } from '../models/exceptions/seneca-action-failed.exception';
import { polyfillPattern } from '../utils/polyfill-pattern.util';
import { Pattern } from '../models/seneca.types';
import { readFileSync } from 'fs';
import { VERSION_NEUTRAL } from '@nestjs/common/interfaces/version-options.interface';
import { UnsupportedVersionException } from '../models/exceptions/unsupported-version.exception';
import { respond } from '../utils/respond.util';
import { VersionValue } from '../models/version.types';

/**
 * https://docs.nestjs.com/microservices/custom-transport
 * The custom transport strategy used to instantiate a Seneca instance to listen to incoming requests
 * This strategy is also used to bind controller action to certain message patterns and teardown logic
 */
export class SenecaStrategy extends Server implements CustomTransportStrategy {
  protected _senecaInstance: Seneca.Instance;
  protected logger: any;
  protected messageHandlers: any;

  constructor(private readonly _options: SenecaStrategyOptions) {
    super();

    // Initializes seneca instance used to listen to incoming messages
    // It also defines some default values
    this._senecaInstance = Seneca({
      log: _options.log ?? 'silent',
      timeout: _options.timeout,
      debug: _options.debug,
      errhandler: _options.errhandler,
      tag: _options.tag,
    });

    // Activates given plugins
    for (const plugin of _options.plugins ?? []) {
      const { module, options } =
        typeof plugin === 'object'
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
  public listen(callback: () => void): void {
    // Cycle through message handlers and their patterns to bind them to the Seneca ecosystem
    // These message handlers (controller actions) are gathered by NestJS through the use of the decorators. (@EventPattern() & @MessagePattern())
    for (const [patternRaw, handler] of this.messageHandlers as [
      string,
      MessageHandler,
    ][]) {
      // https://docs.nestjs.com/microservices/basics#event-based
      // Returns true if @EventPattern() decorator was used (this type of communication is not used in our microservice environment)
      if (handler.isEventHandler)
        throw new Error(
          `The package '${process.env.npm_package_name}' does not support event messages`,
        );

      // Prepends required keys and autofills role & cmd keys if none was yet given
      const pattern: Pattern = polyfillPattern(
        patternRaw,
        this._options.role,
        this._options.cmdKey,
        this._options.roleKey,
      );

      // fast lookup table for the presence of a given version
      const versionHashMap = new Set(Object.keys(handler.versions));
      // checks if current api can be used version neutrally
      const isVersionNeutral = versionHashMap.has(VERSION_NEUTRAL.toString());
      // get the latest (VERSION_NEUTRAL is latest) version implementation in case it does not have to be selected later
      let usableVersion: VersionValue = Object.keys(handler.versions)[
        versionHashMap.size - 1
      ];

      try {
        // https://senecajs.org/api/#method-add
        // Inserts the pattern into the Seneca ecosystem and binds it to the accompanying handler (controller action)
        this._senecaInstance.add(pattern, async (msg, reply) => {
          try {
            // get acceptable versions
            const acceptableVersions: VersionValue[] = [
              this.versionExtractor?.(msg) ?? [],
            ].flat() as VersionValue[];

            // check if versioning is enabled & acceptable versions are present
            if (this.versioningEnabled) {
              // checks if one of the acceptable versions is available and thus usable
              const acceptedVersion = acceptableVersions.find((v) =>
                versionHashMap.has(v.toString()),
              );

              // if no acceptable version was available, throw unsupported api version exception
              if (!(acceptedVersion || isVersionNeutral)) {
                return reply(
                  respond(
                    new UnsupportedVersionException(new Error().stack),
                  ) as any,
                );
              }

              // otherwise use the accepted version it's api implementation
              usableVersion = acceptedVersion ?? VERSION_NEUTRAL;
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
          } catch (e: any) {
            // if reply() threw an error, reply with SenecaActionFailedException().
            // errors thrown in handler() are dealt with using ExceptionFilters
            reply(new SenecaActionFailedException(msg.action, e.stack));
          }
        });
      } catch (e) {
        throw new Error(`The given message pattern ('${pattern}') is invalid`);
      }
    }

    // Starts the seneca instance to listen for the patterns
    // It also defines some default values
    this._options.listener.type ??= 'http';
    this._senecaInstance.listen({
      type: this._options.listener.type,
      host: this._options.listener.host.toString(),
      port: this._options.listener.port.toString(),
      serverOptions: this._options.listener.serverOptions && {
        key: readFileSync(this._options.listener.serverOptions.key, 'utf8'),
        cert: readFileSync(this._options.listener.serverOptions.cert, 'utf8'),
      },
    });

    // Calls the callback() method when it is ready to accept connections
    this._senecaInstance.ready(() => {
      const listenSpecs = `${
        this._options.listener.serverOptions ? 'TLS' : 'NON-TLS'
      } ${this._options.listener.type}://${this._options.listener.host}:${
        this._options.listener.port
      }`;
      this.logger[this._options.listener.serverOptions ? 'log' : 'warn'](
        `SenecaInstance listening on: ${listenSpecs}`,
      );
      callback();
    });
  }

  /**
   * This method is called when the Nest application calls the close() method
   * It is responsible for the teardown logic of the strategy
   */
  public close(): void {
    this.logger.log('Closing Seneca instance...');
    this._senecaInstance.close(() =>
      this.logger.log('Seneca instance successfully closed'),
    );
  }
}
