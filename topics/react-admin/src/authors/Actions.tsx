import { FC } from 'react';
import { CreateButton, TopToolbar } from 'react-admin';
import { usePermissions } from 'src/lib/react-admin/usePermissions';

export const Actions: FC = (props) => {
  const { isAdmin } = usePermissions();

  return <TopToolbar {...props}>{isAdmin && <CreateButton />}</TopToolbar>;
};
