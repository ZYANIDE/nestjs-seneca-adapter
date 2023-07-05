import { SenecaApplicationOptions } from '../../models/options/seneca-application.options';
/**
 * AppSettings is used to create and save a snapshot of the Nest application app-settings on initialization
 */
export declare class AppSettings<T extends SenecaApplicationOptions = SenecaApplicationOptions> {
    protected readonly _settings: T;
    constructor(_settings: T);
    snapshot: () => T;
}
