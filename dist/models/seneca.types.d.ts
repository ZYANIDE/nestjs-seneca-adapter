import { ApiVersion, SenecaCmd, SenecaRole } from './dto.types';
/**
 * Types used by seneca, but are not explicitly given as types by @types/seneca
 */
export type Port = number;
export type Host = string;
export type Path = string;
export type SenecaType = 'http' | 'tcp' | string;
export type SenecaServerOption = {
    key: Path;
    cert: Path;
};
export type PatternObject = {
    [key: string]: string | undefined;
    action: SenecaCmd;
    role?: SenecaRole;
    version?: ApiVersion;
} | {
    [key: string]: string | undefined;
    cmd: SenecaCmd;
    role?: SenecaRole;
    version?: ApiVersion;
};
export type PatternString = string;
export type Pattern = PatternString | PatternObject;
