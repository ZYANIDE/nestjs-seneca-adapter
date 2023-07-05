import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
import { NodeEnvironment } from '../models/node-environment.enum';
import { Path } from '../models/seneca.types';
/**
 * Seneca application config type obligating the use of at least one config
 * This can be the global or an environment specific config
 */
export type SenecaApplicationConfig<TSettings extends SenecaApplicationOptions = SenecaApplicationOptions> = {
    global: Path | TSettings;
    [NodeEnvironment.local]?: Path | Partial<TSettings>;
    [NodeEnvironment.dev]?: Path | Partial<TSettings>;
    [NodeEnvironment.test]?: Path | Partial<TSettings>;
    [NodeEnvironment.prod]?: Path | Partial<TSettings>;
} | {
    global?: Path | Partial<TSettings>;
    [NodeEnvironment.local]: Path | TSettings;
    [NodeEnvironment.dev]?: Path | Partial<TSettings>;
    [NodeEnvironment.test]?: Path | Partial<TSettings>;
    [NodeEnvironment.prod]?: Path | Partial<TSettings>;
} | {
    global?: Path | Partial<TSettings>;
    [NodeEnvironment.local]?: Path | Partial<TSettings>;
    [NodeEnvironment.dev]: Path | TSettings;
    [NodeEnvironment.test]?: Path | Partial<TSettings>;
    [NodeEnvironment.prod]?: Path | Partial<TSettings>;
} | {
    global?: Path | Partial<TSettings>;
    [NodeEnvironment.local]?: Path | Partial<TSettings>;
    [NodeEnvironment.dev]?: Path | Partial<TSettings>;
    [NodeEnvironment.test]: Path | TSettings;
    [NodeEnvironment.prod]?: Path | Partial<TSettings>;
} | {
    global?: Path | Partial<TSettings>;
    [NodeEnvironment.local]?: Path | Partial<TSettings>;
    [NodeEnvironment.dev]?: Path | Partial<TSettings>;
    [NodeEnvironment.test]?: Path | Partial<TSettings>;
    [NodeEnvironment.prod]: Path | TSettings;
};
/**
 * This utility can be used to have an easier time creating and managing app-settings for the Seneca Nest application microservice
 *
 * @param config Representation of all app-settings for all environments
 */
export declare const configuration: <TSettings extends SenecaApplicationOptions = SenecaApplicationOptions>(config: string | SenecaApplicationConfig<TSettings>) => TSettings;
