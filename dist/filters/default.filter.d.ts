import { ExceptionFilter } from '@nestjs/common';
import { ErrorResponse } from '../models/dto/response.dto';
/**
 * https://docs.nestjs.com/exception-filters
 * Exception filters can be used to catch errors that were not manually caught by the application
 * This exception filter uses the default respond() function to respond to the given request
 * It also logs any non-client error it comes across
 */
export declare class DefaultExceptionFilter implements ExceptionFilter {
    catch(error: Error): ErrorResponse;
}
