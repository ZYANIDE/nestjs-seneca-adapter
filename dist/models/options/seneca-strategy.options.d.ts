import { SenecaListenOptions } from './seneca-listen.options';
import { SenecaInstanceOptions } from './seneca-instance.options';
import { SenecaClientOptions } from './seneca-client.options';
import { Instance as SenecaInstance, PluginModule, PluginOptions } from 'seneca';
/**
 * Options given to the SenecaStrategy
 */
export interface SenecaStrategyOptions extends SenecaInstanceOptions {
    cmdKey?: string;
    roleKey?: string;
    role?: string;
    expose?: (senecaInstance: SenecaInstance) => SenecaInstance;
    listener: SenecaListenOptions;
    clients?: SenecaClientOptions[];
    plugins?: (PluginModule | {
        module: PluginModule;
        options?: PluginOptions;
    })[];
}
