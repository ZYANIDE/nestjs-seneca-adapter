import { ClientId, SenecaCmd, SenecaRole } from '../dto.types';
/**
 * Properties a body needs to qualify as a valid seneca request
 */
export interface ISenecaRequest {
    cmd?: SenecaCmd;
    action?: SenecaCmd;
    role: SenecaRole;
    version?: number;
}
/**
 * Properties needed to know which resources belong to the requester
 */
interface IClientRequest {
    clientId: ClientId;
}
/**
 * Properties needed to create a request body with a payload
 */
interface IPayloadRequest<T> {
    payload?: T;
}
/**
 * Properties needed to create a generic request body
 */
export interface IGenericRequest<T> extends ISenecaRequest, IPayloadRequest<T> {
}
/**
 * Properties needed to create a generic client request body
 */
export interface IGenericClientRequest<T> extends ISenecaRequest, IPayloadRequest<T>, IClientRequest {
}
/**
 * A class representing a SenecaRequest to attach validation rules to its properties
 */
export declare class SenecaRequest implements ISenecaRequest {
    cmd: SenecaCmd;
    action: SenecaCmd;
    role: SenecaRole;
    version?: number;
    transport$: object;
    tx$: object;
}
/**
 * A class representing a PayloadRequest over Seneca to attach validation rules to its properties
 */
export declare class SenecaPayloadRequest<T> extends SenecaRequest implements IPayloadRequest<T> {
    payload?: T;
}
/**
 * A class representing a ClientRequest over Seneca to attach validation rules to its properties
 */
export declare class ClientRequest<T> extends SenecaPayloadRequest<T> implements IClientRequest {
    clientId: ClientId;
}
/**
 * A class representing a GenericRequest over Seneca to attach validation rules to its properties
 */
export declare class GenericRequest<T> extends SenecaPayloadRequest<T> implements IGenericRequest<T> {
}
/**
 * A class representing a GenericClientRequest over Seneca to attach validation rules to its properties
 */
export declare class GenericClientRequest<T> extends ClientRequest<T> implements IGenericClientRequest<T> {
}
export {};
