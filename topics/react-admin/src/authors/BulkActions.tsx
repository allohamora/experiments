import { FC } from 'react';
import { BulkDeleteButton, BulkExportButton, BulkUpdateButton } from 'react-admin';
import { usePermissions } from 'src/lib/react-admin/usePermissions';

export const BulkActions: FC = ({ children, ...props }) => {
  const { isAdmin } = usePermissions();

  return (
    <>
      {isAdmin && <BulkDeleteButton {...props} />}
      <BulkExportButton {...props} />
      {isAdmin && <BulkUpdateButton {...props} />}
    </>
  );
};
