import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ErrorResponse } from '../models/dto/response.dto';
import { respond } from '../utils/respond.util';
import { ClientException } from '../models/exceptions/client.exception';

/**
 * https://docs.nestjs.com/exception-filters
 * Exception filters can be used to catch errors that were not manually caught by the application
 * This exception filter uses the default respond() function to respond to the given request
 * It also logs any non-client error it comes across
 */
@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  catch(error: Error): ErrorResponse {
    if (!(error instanceof ClientException)) Logger.error(error);
    return respond(error);
  }
}
