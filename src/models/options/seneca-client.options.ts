import { ClientOptions } from 'seneca';
import { Host, Port, SenecaType } from '../seneca.types';

/**
 * https://senecajs.org/api/#method-client
 * Options needed to connect to other seneca clients
 */
export interface SenecaClientOptions extends ClientOptions {
  type?: SenecaType;
  name?: string; // serves no purpose besides allowing more readability in the config file
  port: Port;
  host: Host;
  pin?: string;
}
