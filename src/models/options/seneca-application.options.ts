import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { SenecaStrategyOptions } from './seneca-strategy.options';

/**
 * Generic options used as app app-settings
 */
export interface SenecaApplicationOptions extends NestMicroserviceOptions {
  seneca: SenecaStrategyOptions;
}
