import { DynamicModule } from '@nestjs/common';
import { SenecaApplicationOptions } from '../models/options/seneca-application.options';
export declare class RootModule {
    /**
     * Generates a module that will be used as a root module for every project.
     * Because this module is global, everything it exports will automatically be imported in all other submodules
     *
     * @param module Submodule entrypoint
     * @param options App app-settings that will be for some exporting modules
     * @return DynamicModule
     */
    static register<TSettings extends SenecaApplicationOptions = SenecaApplicationOptions>(module: any, options: TSettings): DynamicModule;
}
