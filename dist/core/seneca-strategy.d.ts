import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { default as Seneca } from 'seneca';
import { SenecaStrategyOptions } from '../models/options/seneca-strategy.options';
/**
 * https://docs.nestjs.com/microservices/custom-transport
 * The custom transport strategy used to instantiate a Seneca instance to listen to incoming requests
 * This strategy is also used to bind controller action to certain message patterns and teardown logic
 */
export declare class SenecaStrategy extends Server implements CustomTransportStrategy {
    private readonly _options;
    protected _senecaInstance: Seneca.Instance;
    protected logger: any;
    protected messageHandlers: any;
    constructor(_options: SenecaStrategyOptions);
    /**
     * This method is called when the Nest application calls the listen() method
     * It must bind message patterns to controller actions and activate the listen mechanic for the strategy
     *
     * @param callback Called when strategy is ready to listen for incoming requests
     */
    listen(callback: () => void): void;
    /**
     * This method is called when the Nest application calls the close() method
     * It is responsible for the teardown logic of the strategy
     */
    close(): void;
}
