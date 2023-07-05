declare module '@nestjs/microservices/microservices-module' {
  import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
  import { NestContainer } from '@nestjs/core/injector/container';
  import { GraphInspector } from '@nestjs/core/inspector/graph-inspector';
  import { ApplicationConfig } from '@nestjs/core/application-config';
  import { CustomTransportStrategy } from '@nestjs/microservices/interfaces';
  import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
  import { Controller } from '@nestjs/common/interfaces/controllers/controller.interface';
  import { ListenersController } from '@nestjs/microservices/listeners-controller';
  import { Server } from '@nestjs/microservices';

  export class MicroservicesModule<
    TAppOptions extends NestApplicationContextOptions = NestApplicationContextOptions,
  > {
    private readonly clientsContainer;
    // made listenersController public
    listenersController: ListenersController;
    private appOptions;
    register(
      container: NestContainer,
      graphInspector: GraphInspector,
      config: ApplicationConfig,
      options: TAppOptions,
    ): void;
    setupListeners(
      container: NestContainer,
      server: Server & CustomTransportStrategy,
    ): void;
    setupClients(container: NestContainer): void;
    bindListeners(
      controllers: Map<string | symbol | Function, InstanceWrapper<Controller>>, // eslint-disable-line
      server: Server & CustomTransportStrategy,
      moduleName: string,
    ): void;
    bindClients(
      items: Map<string | symbol | Function, InstanceWrapper<unknown>>, // eslint-disable-line
    ): void;
    close(): Promise<void>;
  }
}
