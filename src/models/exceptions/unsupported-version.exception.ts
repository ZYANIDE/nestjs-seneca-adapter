import { ClientException } from './client.exception';

/**
 * Used as an error when api does not support the request acceptable versions
 */
export class UnsupportedVersionException extends ClientException {
  constructor(stack?: string) {
    super(
      'UNSUPPORTED_API_VERSION',
      'The API matching the given message pattern does not support any of the acceptable versions',
      426,
      stack,
    );
  }
}
