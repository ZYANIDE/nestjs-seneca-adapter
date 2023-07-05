import { ExtractPayloadPipe } from './extract-payload.pipe';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

describe('ExtractPayloadPipeline', () => {
  let pipe: PipeTransform;
  beforeEach(() => {
    pipe = new ExtractPayloadPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return payload property', () => {
    const payload: any = 'payloadValue';
    const body: any = {
      clientId: 5,
      action: 'lorem_ipsum',
      payload,
      role: 'bobby',
    };

    expect(pipe.transform(body, {} as ArgumentMetadata)).toBe(payload);
  });
});
