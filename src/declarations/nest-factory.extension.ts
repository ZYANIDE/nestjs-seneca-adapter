import { NestFactory } from '@nestjs/core';
import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
import { SenecaApplication } from '../core/seneca-application';
import { SenecaApplicationFactory } from '../core/seneca-application.factory';

/**
 * This is used to declare a new property to NestFactory
 */
declare module '@nestjs/core/nest-factory' {
  interface NestFactoryStatic {
    /**
     * Creates a Seneca Nest microservice application
     *
     * @param module Entrypoint module
     * @param options App app-settings
     */
    createSenecaMicroservice<
      TSetting extends SenecaApplicationOptions = SenecaApplicationOptions,
    >(
      module: any,
      options: TSetting,
    ): Promise<SenecaApplication>;
  }
}

/**
 * This initializes the declared property of NestFactory so it can be used to create a Seneca Nest microservice application
 */
NestFactory.createSenecaMicroservice = <
  TSetting extends SenecaApplicationOptions = SenecaApplicationOptions,
>(
  module: any,
  options: TSetting,
): Promise<SenecaApplication> => SenecaApplicationFactory(module, options);
