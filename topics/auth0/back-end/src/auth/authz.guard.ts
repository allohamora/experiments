import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permision } from './permission.enum';
import { User } from './user.entity';

const arrayToMap = <V>(array: V[]) => {
  return array.reduce(
    (state, value) => state.set(value, value),
    new Map<V, V>(),
  );
};

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // scope is permissions that app requires. permissions are what user can do.
  private getTokenPermissions({ scope, permissions }: User) {
    const scopePermissions = scope.split(' ');
    const scopeMap = arrayToMap(scopePermissions);

    return permissions.filter((permission) => scopeMap.has(permission));
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const tokenPermissions = this.getTokenPermissions(req.user);
    const tokenPermissionsMap = arrayToMap(tokenPermissions);
    const permissions = this.reflector.get(
      'permissions',
      context.getHandler(),
    ) as Permision[];

    return permissions.every((permission) =>
      tokenPermissionsMap.has(permission),
    );
  }
}
