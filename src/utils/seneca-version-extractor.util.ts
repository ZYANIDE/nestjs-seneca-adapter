import { ISenecaRequest } from '../models/dto/request.dto';
import { VERSION_NEUTRAL } from '@nestjs/common';
import { VersionValue } from '../models/version.types';

export const senecaVersionExtractor = (
  request: ISenecaRequest,
): VersionValue => {
  return request.version?.toString() ?? VERSION_NEUTRAL;
};
