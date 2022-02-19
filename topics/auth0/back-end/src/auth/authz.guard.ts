import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permision } from './permission.enum';
import { User } from './user.entity';

const arrayToMap = <V>(array: V[]) => {
  const result = new Map<V, V>();

  for (const item of array) {
    result.set(item, item);
  }

  return result;
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
    const permissions = this.reflector.get(
      'permissions',
      context.getHandler(),
    ) as Permision[];

    return permissions.every((permission) =>
      tokenPermissions.some(
        (tokenPermission) => permission === tokenPermission,
      ),
    );
  }
}
