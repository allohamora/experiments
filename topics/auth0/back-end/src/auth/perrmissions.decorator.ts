import { SetMetadata } from '@nestjs/common';
import { Permision } from './permission.enum';

export const Permissions = (...permissions: Permision[]) =>
  SetMetadata('permissions', permissions);
