import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
import { NodeEnvironment } from '../models/node-environment.enum';
import { Path } from '../models/seneca.types';
import { isAbsolute, join } from 'path';
import { readFileSync } from 'fs';

/**
 * Seneca application config type obligating the use of at least one config
 * This can be the global or an environment specific config
 */
export type SenecaApplicationConfig<
  TSettings extends SenecaApplicationOptions = SenecaApplicationOptions,
> =
  | {
      global: Path | TSettings;
      [NodeEnvironment.local]?: Path | Partial<TSettings>;
      [NodeEnvironment.dev]?: Path | Partial<TSettings>;
      [NodeEnvironment.test]?: Path | Partial<TSettings>;
      [NodeEnvironment.prod]?: Path | Partial<TSettings>;
    }
  | {
      global?: Path | Partial<TSettings>;
      [NodeEnvironment.local]: Path | TSettings;
      [NodeEnvironment.dev]?: Path | Partial<TSettings>;
      [NodeEnvironment.test]?: Path | Partial<TSettings>;
      [NodeEnvironment.prod]?: Path | Partial<TSettings>;
    }
  | {
      global?: Path | Partial<TSettings>;
      [NodeEnvironment.local]?: Path | Partial<TSettings>;
      [NodeEnvironment.dev]: Path | TSettings;
      [NodeEnvironment.test]?: Path | Partial<TSettings>;
      [NodeEnvironment.prod]?: Path | Partial<TSettings>;
    }
  | {
      global?: Path | Partial<TSettings>;
      [NodeEnvironment.local]?: Path | Partial<TSettings>;
      [NodeEnvironment.dev]?: Path | Partial<TSettings>;
      [NodeEnvironment.test]: Path | TSettings;
      [NodeEnvironment.prod]?: Path | Partial<TSettings>;
    }
  | {
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
export const configuration = <
  TSettings extends SenecaApplicationOptions = SenecaApplicationOptions,
>(
  config: Path | SenecaApplicationConfig<TSettings>,
): TSettings => {
  // short function to get return an absolute path from process.cwd() if a relative one was given
  const getAbsolutePath = (path: string) =>
    isAbsolute(path) ? path : join(process.cwd(), path);

  // get NODE_ENV
  const nodeEnv = process.env.NODE_ENV as NodeEnvironment;

  // if string was given instead of an object representing the config, use the string as path to a config json file
  if (typeof config === 'string')
    config = JSON.parse(
      readFileSync(getAbsolutePath(config), { encoding: 'utf-8' }),
    ) as SenecaApplicationConfig<TSettings>;
  if (typeof config.global === 'string')
    config.global = JSON.parse(
      readFileSync(getAbsolutePath(config.global), { encoding: 'utf-8' }),
    ) as TSettings;
  if (typeof config[nodeEnv] === 'string')
    config[nodeEnv] = JSON.parse(
      readFileSync(getAbsolutePath(config[nodeEnv] as string), {
        encoding: 'utf-8',
      }),
    ) as TSettings;

  // use the global settings as fallback settings and node environment specific settings as main settings
  // this is why environment specific config will overwrite the global config
  return overwriteNestedVariable(
    config.global ?? {},
    config[nodeEnv] ?? {},
  ) as TSettings;
};

/**
 * overwrite the source variable with the target variable
 * this function can handle nested objects
 *
 * @param source the subject to be overwritten
 * @param target the object that will overwrite source
 */
const overwriteNestedVariable = <T>(source: T, target: T): T => {
  if (typeof target !== 'object') return target;

  const cache: T = { ...source };
  for (const key in target) {
    cache[key] = overwriteNestedVariable(
      source[key] ?? ({} as any),
      target[key],
    );
  }

  return cache;
};
