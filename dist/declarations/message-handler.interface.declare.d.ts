declare module '@nestjs/microservices' {
    import { Observable } from 'rxjs';
    import { VersionValue } from 'nestjs-seneca-adapter';
    interface MessageHandler<TInput = any, TContext = any, TResult = any> {
        next?: (data: TInput, ctx?: TContext) => Promise<Observable<TResult>> | Promise<TResult>;
        isEventHandler?: boolean;
        extras?: Record<string, any>;
        versions: Record<VersionValue, (data: TInput, ctx?: TContext) => Promise<Observable<TResult>> | Promise<TResult>>;
    }
}
