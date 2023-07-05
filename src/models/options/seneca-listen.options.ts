import { ListenOptions } from 'seneca';
import { Port, Host, SenecaServerOption, SenecaType } from '../seneca.types';

/**
 * https://senecajs.org/api/#method-listen
 * Options that the seneca instance will use to initialize its listener
 */
export interface SenecaListenOptions extends ListenOptions {
  type?: SenecaType;
  host: Host;
  port: Port;
  serverOptions?: SenecaServerOption;
}
