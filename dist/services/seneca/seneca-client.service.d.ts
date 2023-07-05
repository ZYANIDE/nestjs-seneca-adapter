import { Instance as SenecaInstance } from 'seneca';
import { OnModuleDestroy } from '@nestjs/common';
import { SenecaClientOptions } from '../../models/options/seneca-client.options';
import { Pattern } from '../../models/seneca.types';
import { AppSettings } from '../app-settings/app-settings.service';
import { Response } from '../../models/dto/response.dto';
/**
 * SenecaClient is used to communicate with other Seneca clients from other services
 * You can connect with other client with the connect() method and communicate with them using the act() method
 */
export declare class SenecaClient implements OnModuleDestroy {
    protected readonly _appSettings: AppSettings;
    protected readonly _senecaInstance: SenecaInstance;
    constructor(_appSettings: AppSettings);
    /**
     * With this method you can connect to other Seneca client of other services
     *
     * @param client Options needed to connect to other Seneca clients
     */
    connect(client: SenecaClientOptions): void;
    /**
     * With this method the current service can send requests to other Seneca clients it has connected to
     *
     * @param pattern Used by other Seneca clients to identify if they should respond to request
     * @param data Data send with the request
     */
    act<TResult>(pattern: Pattern, data?: object): Promise<Response<TResult>>;
    /**
     * Responsible for the teardown logic of the SenecaClient
     */
    onModuleDestroy(): Promise<void>;
}
