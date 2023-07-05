import { SenecaApplication } from './seneca-application';
import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
import { NestFactory } from '@nestjs/core';
import { INestMicroservice } from '@nestjs/common/interfaces/nest-microservice.interface';
import { SenecaStrategy } from './seneca-strategy';
import { CustomStrategy } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { RootModule } from './root.module';
import { NodeEnvironment } from '../models/node-environment.enum';
import { isEnvVar } from '../utils/is-env-var.util';
import { Logger } from '@nestjs/common';

/**
 * A factory function for the Seneca application
 *
 * @param module Entrypoint module of the application
 * @param options App app-settings that will be used to initialize the application
 * @constructor
 */
export const SenecaApplicationFactory = async <
  TSetting extends SenecaApplicationOptions = SenecaApplicationOptions,
>(
  module: any,
  options: TSetting,
) => {
  // Check if all required app app-settings are given
  if (!options.seneca.listener.host || !options.seneca.listener.port)
    throw new Error('Required config properties are not defined');

  // Get node environment
  const nodeEnv = process.env.NODE_ENV;

  // Initialize a Nest application microservice to be a base for the SenecaApplication which will wrap around it so functionalities written by Nest won't have to be reinvented
  const app: INestMicroservice =
    (await NestFactory.createMicroservice<CustomStrategy>(
      RootModule.register(module, options),
      {
        strategy: new SenecaStrategy(options.seneca), // The custom Seneca transport strategy so the application runs on a Seneca instance
        logger: options.logger ?? ['error', 'warn', 'log'],
        abortOnError: options.abortOnError ?? true,
        bufferLogs: options.bufferLogs ?? false,
        autoFlushLogs: options.autoFlushLogs ?? true,
        preview: options.preview ?? false,
        snapshot: options.snapshot ?? false,
      },
    )) as INestMicroservice;

  // Show the value of node environment and if it is not recognized as a predefined one, give a warning
  if (!Object.keys(NodeEnvironment).includes(nodeEnv as string))
    Logger.warn(
      `Environment variable 'NODE_ENV' ('${nodeEnv}') not recognized`,
    );
  else
    Logger[nodeEnv === NodeEnvironment.prod ? 'log' : 'warn'](
      `Environment variable 'NODE_ENV' ('${nodeEnv}') has been set`,
    );

  // Give a warning if the VERBOSE flag has been set
  if (isEnvVar('VERBOSE'))
    Logger.warn(`Environment variable 'VERBOSE' flag has been set`);

  // Show an indication if the NO_COLOR flag has been set
  if (isEnvVar('NO_COLOR'))
    Logger.log(`Environment variable 'NO_COLOR' flag has been set`);

  // Show how many seneca clients have been found in the app app-settings
  const clientCount = options.seneca.clients?.length ?? 0;
  Logger.log(
    `Found ${clientCount} seneca client${
      clientCount !== 1 ? 's' : ''
    } during initialization`,
  );

  // Initialize the wrapper and return after connecting to the given Seneca clients
  return new SenecaApplication(app).connectSenecaClient(
    ...(options.seneca.clients ?? []),
  );
};
