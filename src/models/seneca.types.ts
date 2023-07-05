import { ApiVersion, SenecaCmd, SenecaRole } from './dto.types';

/**
 * Types used by seneca, but are not explicitly given as types by @types/seneca
 */

export type Port = number;
export type Host = string;
export type Path = string;

// protocols that seneca can communicate over
export type SenecaType = 'http' | 'tcp' | string;

// allows extra options for seneca server
export type SenecaServerOption = {
  key: Path;
  cert: Path;
};

// message pattern for seneca in object format
export type PatternObject =
  | {
      [key: string]: string | undefined;
      action: SenecaCmd;
      role?: SenecaRole;
      version?: ApiVersion;
    }
  | {
      [key: string]: string | undefined;
      cmd: SenecaCmd;
      role?: SenecaRole;
      version?: ApiVersion;
    };
export type PatternString = string;

// message pattern for seneca (jsonic string or json object)
export type Pattern = PatternString | PatternObject;
