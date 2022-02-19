import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthzGuard } from './authz.guard';
import { Permision } from './permission.enum';
import { Permissions } from './perrmissions.decorator';

interface AuthOptions {
  permissions?: Permision[];
}

export const Auth = ({ permissions = [] }: AuthOptions = {}) =>
  applyDecorators(
    Permissions(...permissions),
    UseGuards(AuthGuard, AuthzGuard),
  );
