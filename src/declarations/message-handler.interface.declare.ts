declare module '@nestjs/microservices' {
  import { Observable } from 'rxjs';
  import { VersionValue } from 'nestjs-seneca-adapter';

  export interface MessageHandler<TInput = any, TContext = any, TResult = any> {
    // message handler is not a function anymore
    next?: (
      data: TInput,
      ctx?: TContext,
    ) => Promise<Observable<TResult>> | Promise<TResult>;
    isEventHandler?: boolean;
    extras?: Record<string, any>;
    // added versions prop
    versions: Record<
      VersionValue,
      (
        data: TInput,
        ctx?: TContext,
      ) => Promise<Observable<TResult>> | Promise<TResult>
    >;
  }
}
