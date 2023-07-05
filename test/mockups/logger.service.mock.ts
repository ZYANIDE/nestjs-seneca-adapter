import { LoggerService } from '@nestjs/common';

export class LoggerServiceMock implements LoggerService {
  error(): void {
    /* do nothing */
  }
  warn(): void {
    /* do nothing */
  }
  log(): void {
    /* do nothing */
  }
  verbose(): void {
    /* do nothing */
  }
  debug(): void {
    /* do nothing */
  }

  setLogLevels(): void {
    /* do nothing */
  }
}
