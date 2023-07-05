import { Test, TestingModule } from '@nestjs/testing';
import { RootModule } from './root.module';
import { EmptyModule } from '../../test/mockups/empty.module';
import { SenecaApplicationOptions } from '../models/options/seneca-application.options';

describe('RootModule', () => {
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        RootModule.register(EmptyModule, {} as SenecaApplicationOptions),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
