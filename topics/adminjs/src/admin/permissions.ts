import { ActionContext } from 'adminjs';
import { Role, RoleType } from 'src/users/role.entity';

export const isRoles = (roleTypes: RoleType[]) => {
  return (ctx: ActionContext) => {
    const userRoleTypes = (ctx.currentAdmin?.roles as Role[]).reduce(
      (roles, role) => roles.set(role.type, role),
      new Map<RoleType, Role>(),
    );

    return roleTypes.every((roleType) => userRoleTypes.has(roleType));
  };
};

export const isAdmin = isRoles([RoleType.Admin]);
export const isEditor = isRoles([RoleType.Editor]);
