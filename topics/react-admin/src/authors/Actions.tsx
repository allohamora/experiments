import { FC } from 'react';
import { CreateButton, TopToolbar } from 'react-admin';
import { usePermissions } from 'src/lib/react-admin/usePermissions';

export const Actions: FC = () => {
  const { isAdmin } = usePermissions();

  return <TopToolbar>{isAdmin && <CreateButton />}</TopToolbar>;
};
