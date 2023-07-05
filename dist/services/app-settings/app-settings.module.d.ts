import { DynamicModule } from '@nestjs/common';
import { SenecaApplicationOptions } from '../../models/options/seneca-application.options';
export declare class AppSettingsModule {
    static register<TSettings extends SenecaApplicationOptions = SenecaApplicationOptions>(options: TSettings): DynamicModule;
}
