import { PipeTransform } from '@nestjs/common';

export class EmptyPipeMock implements PipeTransform {
  transform(): any {
    return undefined;
  }
}
