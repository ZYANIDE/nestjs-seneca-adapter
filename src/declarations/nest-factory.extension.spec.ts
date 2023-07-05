import '../index';
import { NestFactory } from '@nestjs/core';
import { EmptyModule } from '../../test/mockups/empty.module';
import { SenecaApplication } from '../core/seneca-application';

describe('NestFactory-extension', () => {
  const runExtension = async () =>
    await NestFactory.createSenecaMicroservice(EmptyModule, {
      seneca: {
        listener: {
          host: 'localhost',
          port: 10101,
        },
      },
    });

  it('should return SenecaApplication', async () => {
    const app = await runExtension();
    expect(app).toBeDefined();
    expect(app).toBeInstanceOf(SenecaApplication);
  });
});
