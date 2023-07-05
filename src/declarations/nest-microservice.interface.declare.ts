declare module '@nestjs/common/interfaces/nest-microservice.interface' {
  import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';
  import { WebSocketAdapter } from '@nestjs/common/interfaces/websockets/web-socket-adapter.interface';
  import { ExceptionFilter, PipeTransform } from '@nestjs/common/interfaces';
  import { NestInterceptor } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
  import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
  import { Server } from '@nestjs/microservices';
  import { MicroservicesModule } from '@nestjs/microservices/microservices-module';

  export interface INestMicroservice extends INestApplicationContext {
    // made server public
    server: Server;
    // made microservicesModule public
    microservicesModule: MicroservicesModule;

    /**
     * Starts the microservice.
     *
     * @returns {void}
     */
    listen(): Promise<any>;
    /**
     * Register Ws Adapter which will be used inside Gateways.
     * Use when you want to override default `socket.io` library.
     *
     * @param {WebSocketAdapter} adapter
     * @returns {this}
     */
    useWebSocketAdapter(adapter: WebSocketAdapter): this;
    /**
     * Registers exception filters as global filters (will be used within every message pattern handler)
     *
     * @param {...ExceptionFilter} filters
     */
    useGlobalFilters(...filters: ExceptionFilter[]): this;
    /**
     * Registers pipes as global pipes (will be used within every message pattern handler)
     *
     * @param {...PipeTransform} pipes
     */
    useGlobalPipes(...pipes: PipeTransform<any>[]): this;
    /**
     * Registers interceptors as global interceptors (will be used within every message pattern handler)
     *
     * @param {...NestInterceptor} interceptors
     */
    useGlobalInterceptors(...interceptors: NestInterceptor[]): this;
    /**
     * Registers guards as global guards (will be used within every message pattern handler)
     *
     * @param {...CanActivate} guards
     */
    useGlobalGuards(...guards: CanActivate[]): this;
    /**
     * Terminates the application
     *
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
  }
}
