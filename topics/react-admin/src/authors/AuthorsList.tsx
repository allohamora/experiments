import { FC } from 'react';
import {
  ChipField,
  Datagrid,
  DeleteButton,
  EditButton,
  List,
  ReferenceArrayField,
  ShowButton,
  SingleFieldList,
  TextField,
} from 'react-admin';
import { ButtonsGroup } from 'src/components/ButtonsGroup';
import { usePermissions } from 'src/lib/react-admin/usePermissions';
import { Actions } from './Actions';
import { BulkActions } from './BulkActions';

export const AuthorLists: FC = (props) => {
  const { isAdmin } = usePermissions();

  return (
    <List bulkActionButtons={<BulkActions />} actions={<Actions />} {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="login" />
        <ReferenceArrayField reference="posts" source="postsIds">
          <SingleFieldList>
            <ChipField source="title" />
          </SingleFieldList>
        </ReferenceArrayField>
        <ButtonsGroup>
          {isAdmin && <EditButton />}
          <ShowButton />
          {isAdmin && <DeleteButton />}
        </ButtonsGroup>
      </Datagrid>
    </List>
  );
};
