import { default as Seneca, Entity, PluginModule } from 'seneca';

export class SenecaInstanceMock implements Seneca.Instance {
  version!: string;

  listen(): this {
    return this;
  }
  ready(): void {
    /* do nothing */
  }
  close(): void {
    /* do nothing */
  }
  client(): this {
    return this;
  }
  pin(): void {
    /* do nothing */
  }

  act<PatternWithArgs = Seneca.Pattern>(
    pattern: PatternWithArgs,
    respond: Seneca.ActCallback,
  ): void;
  act<PatternWithArgs = Seneca.Pattern>(
    pattern: PatternWithArgs,
    msg: any,
    respond: Seneca.ActCallback,
  ): void;
  act(): void {
    /* do nothing */
  }
  add<PatternType = any, CallBackParams = any>(
    pattern: PatternType,
    action: Seneca.AddCallback<PatternType & CallBackParams>,
  ): this;
  add<PatternType = any, CallbackParams = any>(
    pattern: PatternType,
    paramspec: any,
    action: Seneca.AddCallback<PatternType & CallbackParams>,
  ): this;
  add(): this {
    return this;
  }
  make(entity_canon: string, properties?: any): Seneca.Entity;
  make(base: string, entity_canon: string, properties?: any): Seneca.Entity;
  make(
    zone: string,
    base: string,
    entity_canon: string,
    properties?: any,
  ): Seneca.Entity;
  make(): Seneca.Entity {
    return {} as Entity;
  }
  use(
    module: Seneca.PluginModule,
    options?: Seneca.PluginOptions | undefined,
  ): this;
  use(name: string, options?: Seneca.PluginOptions | undefined): this;
  use(): this {
    return this;
  }

  error(): void {
    /* do nothing */
  }
  options(): void {
    /* do nothing */
  }
  export(): Seneca.PluginModule {
    return {} as PluginModule;
  }
  on() {
    /* do nothing */
  }
}
