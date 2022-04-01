import { usePermissions as useOriginal } from 'react-admin';

export const getPermissions = (permissions: string[] = []) => {
  const isAdmin = permissions.some((permission) => permission === 'admin');
  const isEditor = permissions.some((permission) => permission === 'editor');

  return { isAdmin, isEditor };
};

export const usePermissions = () => {
  const { permissions = [] } = useOriginal<string[]>();

  return getPermissions(permissions);
};
