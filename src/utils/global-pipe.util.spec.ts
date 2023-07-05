import { globalPipe } from './global-pipe.util';
import {
  ArgumentMetadata,
  FactoryProvider,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

describe('globalPipe()', () => {
  it('should return a Provider of APP_PIPE', () => {
    const provider = globalPipe();
    expect(provider.provide).toBe(APP_PIPE);
  });

  it('should return a Provider with request based scope', () => {
    const provider = globalPipe();
    expect(provider.scope).toBe(Scope.REQUEST);
  });

  it('should call each pipe given to it when called', async () => {
    const addNumberToSequence = (value: string, no: number) => {
      value += no.toString();
      return value;
    };

    const mockPipe1: PipeTransform = {
      transform: (value: string) => addNumberToSequence(value, 1),
    };
    const mockPipe2: PipeTransform = {
      transform: (value: string) => addNumberToSequence(value, 2),
    };
    const mockPipe3: PipeTransform = {
      transform: (value: string) => addNumberToSequence(value, 3),
    };
    const provider: FactoryProvider = globalPipe(
      mockPipe1,
      mockPipe2,
      mockPipe3,
    );
    const value = await provider
      .useFactory()
      .transform('', {} as ArgumentMetadata);
    expect(value).toBe('123');
  });
});
