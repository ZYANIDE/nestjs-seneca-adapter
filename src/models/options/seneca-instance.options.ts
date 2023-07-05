import { Options } from 'seneca';

/**
 * https://senecajs.org/api/#method-seneca
 * Options used to initialize seneca instance that will listen to incoming requests
 */
export type SenecaInstanceOptions = Partial<
  Pick<Options, 'log' | 'errhandler' | 'timeout' | 'debug' | 'tag'>
>;
