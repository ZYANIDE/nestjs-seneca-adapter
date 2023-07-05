import { SenecaListenOptions } from './seneca-listen.options';
import { SenecaInstanceOptions } from './seneca-instance.options';
import { SenecaClientOptions } from './seneca-client.options';
import {
  Instance as SenecaInstance,
  PluginModule,
  PluginOptions,
} from 'seneca';

/**
 * Options given to the SenecaStrategy
 */
export interface SenecaStrategyOptions extends SenecaInstanceOptions {
  cmdKey?: string;
  roleKey?: string;
  role?: string;
  expose?: (senecaInstance: SenecaInstance) => SenecaInstance;
  listener: SenecaListenOptions; // options for the seneca listener
  clients?: SenecaClientOptions[]; // array of seneca clients to connect to
  plugins?: (
    | PluginModule
    | { module: PluginModule; options?: PluginOptions }
  )[];
}
