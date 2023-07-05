import {
  Allow,
  IsDefined,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
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
export interface IGenericRequest<T>
  extends ISenecaRequest,
    IPayloadRequest<T> {}

/**
 * Properties needed to create a generic client request body
 */
export interface IGenericClientRequest<T>
  extends ISenecaRequest,
    IPayloadRequest<T>,
    IClientRequest {}

/**
 * A class representing a SenecaRequest to attach validation rules to its properties
 */
export class SenecaRequest implements ISenecaRequest {
  @ValidateIf((req: SenecaRequest) => !req.action)
  @IsDefined()
  @IsString()
  cmd!: SenecaCmd;

  @ValidateIf((req: SenecaRequest) => !req.cmd)
  @IsDefined()
  @IsString()
  action!: SenecaCmd;

  @IsDefined()
  @IsString()
  role!: SenecaRole;

  @IsOptional()
  @IsNumber()
  version?: number;

  @Allow()
  transport$!: object;

  @Allow()
  tx$!: object;
}

/**
 * A class representing a PayloadRequest over Seneca to attach validation rules to its properties
 */
export class SenecaPayloadRequest<T>
  extends SenecaRequest
  implements IPayloadRequest<T>
{
  @IsOptional()
  payload?: T;
}

/**
 * A class representing a ClientRequest over Seneca to attach validation rules to its properties
 */
export class ClientRequest<T>
  extends SenecaPayloadRequest<T>
  implements IClientRequest
{
  @IsDefined()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  clientId!: ClientId;
}

/**
 * A class representing a GenericRequest over Seneca to attach validation rules to its properties
 */
export class GenericRequest<T>
  extends SenecaPayloadRequest<T>
  implements IGenericRequest<T> {}

/**
 * A class representing a GenericClientRequest over Seneca to attach validation rules to its properties
 */
export class GenericClientRequest<T>
  extends ClientRequest<T>
  implements IGenericClientRequest<T> {}
