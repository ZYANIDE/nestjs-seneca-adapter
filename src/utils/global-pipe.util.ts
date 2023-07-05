import {
  ArgumentMetadata,
  FactoryProvider,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { InjectionToken } from '@nestjs/common/interfaces/modules/injection-token.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';

/**
 * A class used to cycle through all the given pipelines in order
 */
class SequentialPipe implements PipeTransform {
  constructor(private readonly _pipelines: PipeTransform[]) {}

  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    for (const pipe of this._pipelines)
      value = await pipe.transform(value, metadata);
    return value;
  }
}

/**
 * This utility allows for an easier time setting up global pipelines with support for request scoped dependency injection
 *
 * @param pipelines The global pipelines
 */
export const globalPipe = (
  ...pipelines: (Type<PipeTransform> | PipeTransform)[]
): FactoryProvider<SequentialPipe> => {
  // list of dependency injection tokens for pipelines and in which order they were given
  const diTokens: { order: number; token: InjectionToken }[] = [];
  // list of ready to use pipelines and in which order they were given
  const transformPipelines: { order: number; pipe: PipeTransform }[] = [];
  // filters dependency injection tokens of pipelines from ready to use pipelines
  pipelines.forEach((pipe, i) => {
    if (pipe instanceof Function) diTokens.push({ order: i, token: pipe });
    else transformPipelines.push({ order: i, pipe });
  });

  return {
    provide: APP_PIPE, // turns this regular provider into a global pipe
    scope: Scope.REQUEST, // allows request scoped pipes to function properly
    useFactory: (...diPipelines) => {
      // map dependency injected pipelines with their corresponding order numbers
      diPipelines = diPipelines.map((pipe, i) => ({
        order: diTokens[i].order,
        pipe,
      }));

      // give the list of pipelines to be executed in order to the sequential pipe
      return new SequentialPipe(
        diPipelines
          .concat(transformPipelines)
          .sort((a, b) => a.order - b.order)
          .map((x) => x.pipe),
      );
    },
    inject: [...diTokens.map((x) => x.token)],
  };
};
