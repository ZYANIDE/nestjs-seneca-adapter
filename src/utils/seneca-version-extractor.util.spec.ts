import { senecaVersionExtractor } from './seneca-version-extractor.util';
import { ISenecaRequest } from '../models/dto/request.dto';

describe('senecaVersionExtractor()', () => {
  it('should return value from .version', () => {
    const API_VERSION = 5;
    const request = { version: API_VERSION };
    const acceptableVersion = senecaVersionExtractor(request as ISenecaRequest);
    expect(acceptableVersion).toBe(API_VERSION.toString());
  });

  it('should have a default', () => {
    const request = {};
    const acceptableVersion = senecaVersionExtractor(request as ISenecaRequest);
    expect(acceptableVersion).toBeDefined();
  });
});
