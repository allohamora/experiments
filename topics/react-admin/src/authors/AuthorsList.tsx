import { FC } from 'react';
import {
  Datagrid,
  DeleteButton,
  EditButton,
  List,
  ReferenceArrayField,
  ShowButton,
  SingleFieldList,
  TextField,
} from 'react-admin';
import { Actions } from 'src/authors/Actions';
import { ChipField } from 'src/components/ChipField';
import { usePermissions } from 'src/lib/react-admin/usePermissions';

export const AuthorLists: FC = (props) => {
  const { isAdmin } = usePermissions();

  return (
    <List {...props} actions={<Actions />}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="login" />
        <ReferenceArrayField reference="posts" source="postsIds">
          <SingleFieldList>
            <ChipField source="title" />
          </SingleFieldList>
        </ReferenceArrayField>
        {isAdmin && <EditButton />}
        <ShowButton />
        {isAdmin && <DeleteButton />}
      </Datagrid>
    </List>
  );
};
