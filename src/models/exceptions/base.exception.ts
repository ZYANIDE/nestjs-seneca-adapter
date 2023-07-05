/**
 * Used as base for every exception the application can use
 * Allows easier error creation due to being able to give a 3rd party stacktrace upon initialization
 */
export class BaseException extends Error {
  constructor(public name: string, public message: string, stack?: string) {
    super();
    this.stack = stack ?? this.stack;
  }
}
