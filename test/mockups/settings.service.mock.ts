import { SenecaApplicationOptions } from '../../src/models/options/seneca-application.options';
import { AppSettings } from '../../src/services/app-settings/app-settings.service';

export class SettingsMock extends AppSettings {
  constructor() {
    super({} as SenecaApplicationOptions);
  }

  public snapshot = (): SenecaApplicationOptions => {
    return {
      seneca: {
        listener: {
          host: 'mock.localhost',
          port: 10101,
        },
      },
    };
  };
}
