import { Instance as SenecaInstance } from 'seneca';
import { default as Seneca } from 'seneca';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SenecaClientOptions } from '../../models/options/seneca-client.options';
import { Pattern } from '../../models/seneca.types';
import { AppSettings } from '../app-settings/app-settings.service';
import { Response } from '../../models/dto/response.dto';

/**
 * SenecaClient is used to communicate with other Seneca clients from other services
 * You can connect with other client with the connect() method and communicate with them using the act() method
 */
@Injectable()
export class SenecaClient implements OnModuleDestroy {
  protected readonly _senecaInstance: SenecaInstance;

  constructor(protected readonly _appSettings: AppSettings) {
    this._senecaInstance = Seneca({ log: 'silent' });
  }

  /**
   * With this method you can connect to other Seneca client of other services
   *
   * @param client Options needed to connect to other Seneca clients
   */
  public connect(client: SenecaClientOptions) {
    client.type ??= this._appSettings.snapshot().seneca.listener.type ?? 'http';
    this._senecaInstance.client({
      type: client.type, // Look at the assignment above for the default
      port: client.port, // required
      host: client.host, // required
      pin: client.pin ?? undefined,
    });

    Logger.log(
      `SenecaClient connected to [${client.name ?? 'UNNAMED SERVICE'}] at: ${
        client.type
      }://${client.host}:${client.port}${client.pin ? `#${client.pin}` : ''}`,
    );
  }

  /**
   * With this method the current service can send requests to other Seneca clients it has connected to
   *
   * @param pattern Used by other Seneca clients to identify if they should respond to request
   * @param data Data send with the request
   */
  public async act<TResult>(
    pattern: Pattern,
    data?: object,
  ): Promise<Response<TResult>> {
    return new Promise((resolve, reject) => {
      this._senecaInstance.act(pattern, data, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  /**
   * Responsible for the teardown logic of the SenecaClient
   */
  public onModuleDestroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this._senecaInstance.close(resolve);
      } catch (e) {
        reject(e);
      }
    });
  }
}
