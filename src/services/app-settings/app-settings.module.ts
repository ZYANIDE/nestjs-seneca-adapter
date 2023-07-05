import { DynamicModule, Module } from '@nestjs/common';
import { AppSettings } from './app-settings.service';
import { SenecaApplicationOptions } from '../../models/options/seneca-application.options';

@Module({})
export class AppSettingsModule {
  public static register<
    TSettings extends SenecaApplicationOptions = SenecaApplicationOptions,
  >(options: TSettings): DynamicModule {
    return {
      global: true,
      module: AppSettingsModule,
      providers: [
        { provide: AppSettings, useValue: new AppSettings<TSettings>(options) },
      ],
      exports: [AppSettings],
    };
  }
}
