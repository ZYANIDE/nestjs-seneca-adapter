import { ClientOptions } from 'seneca';
import { Host, Port, SenecaType } from '../seneca.types';
/**
 * https://senecajs.org/api/#method-client
 * Options needed to connect to other seneca clients
 */
export interface SenecaClientOptions extends ClientOptions {
    type?: SenecaType;
    name?: string;
    port: Port;
    host: Host;
    pin?: string;
}
