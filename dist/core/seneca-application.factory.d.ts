import { SenecaApplication } from './seneca-application';
import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
/**
 * A factory function for the Seneca application
 *
 * @param module Entrypoint module of the application
 * @param options App app-settings that will be used to initialize the application
 * @constructor
 */
export declare const SenecaApplicationFactory: <TSetting extends SenecaApplicationOptions = SenecaApplicationOptions>(module: any, options: TSetting) => Promise<SenecaApplication>;
