import { usePermissions, useRedirect } from 'react-admin';

export const usePermissionRedirect = (target: string[]) => {
  const { permissions = [], loading } = usePermissions<string[]>();
  const redirect = useRedirect();
  const isTarget = permissions.some((permission) => target.some((targetPermission) => permission === targetPermission));

  if (!isTarget && !loading) {
    redirect('/');
  }
};
