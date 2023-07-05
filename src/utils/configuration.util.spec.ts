import { configuration, SenecaApplicationConfig } from './configuration.util';
import { NodeEnvironment } from '../models/node-environment.enum';
import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
import { join } from 'path';
import { readFileSync } from 'fs';

interface SenecaApplicationOptionsMock extends SenecaApplicationOptions {
  isGlobal?: boolean;
}

describe('configuration()', () => {
  const GLOBAL_PORT = 10101;
  const GLOBAL_HOST = 'global.localhost';
  const LOCAL_HOST = 'local.localhost';
  const DEV_HOST = 'dev.localhost';
  const TEST_HOST = 'test.localhost';
  const PROD_HOST = 'prod.localhost';
  const GLOBAL_SETTINGS: SenecaApplicationOptionsMock = JSON.parse(
    readFileSync(
      join(process.cwd(), './test/mockups/config/global.config.mock.json'),
      { encoding: 'utf8' },
    ),
  );
  const LOCAL_SETTINGS: SenecaApplicationOptionsMock = JSON.parse(
    readFileSync(
      join(process.cwd(), './test/mockups/config/local.config.mock.json'),
      { encoding: 'utf8' },
    ),
  );
  const DEV_SETTINGS: SenecaApplicationOptionsMock = JSON.parse(
    readFileSync(
      join(process.cwd(), './test/mockups/config/dev.config.mock.json'),
      {
        encoding: 'utf8',
      },
    ),
  );
  const TEST_SETTINGS: SenecaApplicationOptionsMock = JSON.parse(
    readFileSync(
      join(process.cwd(), './test/mockups/config/test.config.mock.json'),
      { encoding: 'utf8' },
    ),
  );
  const PROD_SETTINGS: SenecaApplicationOptionsMock = JSON.parse(
    readFileSync(
      join(process.cwd(), './test/mockups/config/prod.config.mock.json'),
      { encoding: 'utf8' },
    ),
  );
  const EXTERNAL_CONFIG_PATH = join(
    process.cwd(),
    './test/mockups/config/config.mock.json',
  );
  let EXTERNAL_CONFIG: SenecaApplicationConfig<SenecaApplicationOptionsMock>;
  let DEFAULT_CONFIG: SenecaApplicationConfig<SenecaApplicationOptionsMock>;
  const cacheNodeEnv = (cb: () => void) => {
    const NODE_ENV = process.env.NODE_ENV;
    cb();
    process.env.NODE_ENV = NODE_ENV;
  };
  const testUseGlobalSettings = (
    config: SenecaApplicationConfig<SenecaApplicationOptionsMock> | string,
    env: NodeEnvironment | undefined,
  ) => {
    process.env.NODE_ENV = env;
    const options: SenecaApplicationOptionsMock = configuration(config);
    expect(options.isGlobal).toBeTruthy();
  };
  const testUseEnvSettings = (
    config: SenecaApplicationConfig<SenecaApplicationOptionsMock> | string,
    env: NodeEnvironment | undefined,
    expectedHost: string,
  ) => {
    process.env.NODE_ENV = env;
    const options: SenecaApplicationOptionsMock = configuration(config);
    expect(options.seneca.listener.host).toBe(expectedHost);
  };
  const testUseNestedEnvSettings = (
    config: SenecaApplicationConfig<SenecaApplicationOptionsMock> | string,
    env: NodeEnvironment | undefined,
    expectedHost: string,
  ) => {
    process.env.NODE_ENV = env;
    const options: SenecaApplicationOptionsMock = configuration(config);
    expect(options.seneca.listener.host).toBe(expectedHost);
    expect(options.seneca.listener.port).toBe(GLOBAL_PORT);
  };

  beforeEach(() => {
    DEFAULT_CONFIG = {
      global: GLOBAL_SETTINGS,
      [NodeEnvironment.local]: LOCAL_SETTINGS,
      [NodeEnvironment.dev]: DEV_SETTINGS,
      [NodeEnvironment.test]: TEST_SETTINGS,
      [NodeEnvironment.prod]: PROD_SETTINGS,
    };

    EXTERNAL_CONFIG = {
      global: './test/mockups/config/global.config.mock.json',
      [NodeEnvironment.local]: './test/mockups/config/local.config.mock.json',
      [NodeEnvironment.dev]: './test/mockups/config/dev.config.mock.json',
      [NodeEnvironment.test]: './test/mockups/config/test.config.mock.json',
      [NodeEnvironment.prod]: './test/mockups/config/prod.config.mock.json',
    };
  });

  it('should return global app-settings regardless of NODE_ENV', () => {
    cacheNodeEnv(() => {
      testUseGlobalSettings(DEFAULT_CONFIG, undefined);
      testUseGlobalSettings(DEFAULT_CONFIG, NodeEnvironment.local);
      testUseGlobalSettings(DEFAULT_CONFIG, NodeEnvironment.dev);
      testUseGlobalSettings(DEFAULT_CONFIG, NodeEnvironment.test);
      testUseGlobalSettings(DEFAULT_CONFIG, NodeEnvironment.prod);
    });
  });

  it('should return env app-settings depending on NODE_ENV', () => {
    cacheNodeEnv(() => {
      testUseEnvSettings(DEFAULT_CONFIG, undefined, GLOBAL_HOST);
      testUseEnvSettings(DEFAULT_CONFIG, NodeEnvironment.local, LOCAL_HOST);
      testUseEnvSettings(DEFAULT_CONFIG, NodeEnvironment.dev, DEV_HOST);
      testUseEnvSettings(DEFAULT_CONFIG, NodeEnvironment.test, TEST_HOST);
      testUseEnvSettings(DEFAULT_CONFIG, NodeEnvironment.prod, PROD_HOST);
    });
  });

  it('should return global app-settings from json if string was given regardless of NODE_ENV', () => {
    cacheNodeEnv(() => {
      testUseGlobalSettings(EXTERNAL_CONFIG, undefined);
      testUseGlobalSettings(EXTERNAL_CONFIG, NodeEnvironment.local);
      testUseGlobalSettings(EXTERNAL_CONFIG, NodeEnvironment.dev);
      testUseGlobalSettings(EXTERNAL_CONFIG, NodeEnvironment.test);
      testUseGlobalSettings(EXTERNAL_CONFIG, NodeEnvironment.prod);
    });
  });

  it('should return env app-settings from json if string was given depending on NODE_ENV', () => {
    cacheNodeEnv(() => {
      testUseEnvSettings(EXTERNAL_CONFIG, undefined, GLOBAL_HOST);
      testUseEnvSettings(EXTERNAL_CONFIG, NodeEnvironment.local, LOCAL_HOST);
      testUseEnvSettings(EXTERNAL_CONFIG, NodeEnvironment.dev, DEV_HOST);
      testUseEnvSettings(EXTERNAL_CONFIG, NodeEnvironment.test, TEST_HOST);
      testUseEnvSettings(EXTERNAL_CONFIG, NodeEnvironment.prod, PROD_HOST);
    });
  });

  it('should return config from json if string was given', () => {
    const config = JSON.parse(
      readFileSync(EXTERNAL_CONFIG_PATH, { encoding: 'utf8' }),
    );
    expect(config).toStrictEqual({
      global: './test/mockups/config/global.config.mock.json',
      [NodeEnvironment.local]: './test/mockups/config/local.config.mock.json',
      [NodeEnvironment.dev]: './test/mockups/config/dev.config.mock.json',
      [NodeEnvironment.test]: './test/mockups/config/test.config.mock.json',
      [NodeEnvironment.prod]: './test/mockups/config/prod.config.mock.json',
    });
  });

  it('should return global app-settings from config path to json file regardless of NODE_ENV', () => {
    const config = JSON.parse(
      readFileSync(EXTERNAL_CONFIG_PATH, { encoding: 'utf-8' }),
    );
    cacheNodeEnv(() => {
      testUseGlobalSettings(config, undefined);
      testUseGlobalSettings(config, NodeEnvironment.local);
      testUseGlobalSettings(config, NodeEnvironment.dev);
      testUseGlobalSettings(config, NodeEnvironment.test);
      testUseGlobalSettings(config, NodeEnvironment.prod);
    });
  });

  it('should return env app-settings from config path to json file depending on NODE_ENV', () => {
    const config = JSON.parse(
      readFileSync(EXTERNAL_CONFIG_PATH, { encoding: 'utf-8' }),
    );
    cacheNodeEnv(() => {
      testUseEnvSettings(config, undefined, GLOBAL_HOST);
      testUseEnvSettings(config, NodeEnvironment.local, LOCAL_HOST);
      testUseEnvSettings(config, NodeEnvironment.dev, DEV_HOST);
      testUseEnvSettings(config, NodeEnvironment.test, TEST_HOST);
      testUseEnvSettings(config, NodeEnvironment.prod, PROD_HOST);
    });
  });

  it('should make NODE_ENV dependable variables overwrite global ones', () => {
    const config = JSON.parse(
      readFileSync(EXTERNAL_CONFIG_PATH, { encoding: 'utf-8' }),
    );
    cacheNodeEnv(() => {
      testUseNestedEnvSettings(config, undefined, GLOBAL_HOST);
      testUseNestedEnvSettings(config, NodeEnvironment.local, LOCAL_HOST);
      testUseNestedEnvSettings(config, NodeEnvironment.dev, DEV_HOST);
      testUseNestedEnvSettings(config, NodeEnvironment.test, TEST_HOST);
      testUseNestedEnvSettings(config, NodeEnvironment.prod, PROD_HOST);
    });
  });
});
