import { ArgumentMetadata, FactoryProvider, PipeTransform } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
/**
 * A class used to cycle through all the given pipelines in order
 */
declare class SequentialPipe implements PipeTransform {
    private readonly _pipelines;
    constructor(_pipelines: PipeTransform[]);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
/**
 * This utility allows for an easier time setting up global pipelines with support for request scoped dependency injection
 *
 * @param pipelines The global pipelines
 */
export declare const globalPipe: (...pipelines: (Type<PipeTransform> | PipeTransform)[]) => FactoryProvider<SequentialPipe>;
export {};
