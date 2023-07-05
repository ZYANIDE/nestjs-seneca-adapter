import { Instance as SenecaInstance } from 'seneca';
import { Logger } from '@nestjs/common';
import { AppSettings } from '../../src/services/app-settings/app-settings.service';
import { SenecaClient } from '../../src/services/seneca/seneca-client.service';
import { Response, SuccessResponse } from '../../src/models/dto/response.dto';

export class SenecaClientMock extends SenecaClient {
  protected readonly _senecaInstance!: SenecaInstance;
  protected readonly _appSettings!: AppSettings;
  protected _logger!: Logger;

  constructor() {
    super({} as AppSettings);
  }

  async act<TResult>(): Promise<Response<TResult>> {
    return new SuccessResponse<TResult>(200, {
      result: {} as any,
    });
  }

  connect(): void {
    /* do nothing */
  }

  onModuleDestroy(): Promise<void>;
  onModuleDestroy(): any;
  onModuleDestroy(): any {
    /* do nothing */
  }
}
