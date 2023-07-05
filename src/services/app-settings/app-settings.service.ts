import { Injectable } from '@nestjs/common';
import { SenecaApplicationOptions } from '../../models/options/seneca-application.options';

/**
 * AppSettings is used to create and save a snapshot of the Nest application app-settings on initialization
 */
@Injectable()
export class AppSettings<
  T extends SenecaApplicationOptions = SenecaApplicationOptions,
> {
  constructor(protected readonly _settings: T) {}

  public snapshot = (): T => this._settings;
}
