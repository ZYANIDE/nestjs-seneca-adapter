import { configuration, NodeEnvironment } from 'nestjs-seneca-adapter';

/**
 * Now you can configure easily using configuration()
 * You can use it in main.ts, e separate *.ts file such as this
 * or you can give a string to configuration() to read the settings from a json file
 * see readme.md for more information
 */
export = configuration({
  global: {
    bufferLogs: true,
    seneca: {
      role: 'DEFAULT_ROLE',
      listener: {
        type: 'http',
        host: 'localhost',
        port: 10101,
      },
      clients: [
        {
          name: 'SomeNamedService',
          host: 'localhost',
          port: 10101,
        },
      ],
    },
  },
  // You can reference a external json file as settings for a specific node environment like this
  [NodeEnvironment.local]: './example/local.config.json',
});
