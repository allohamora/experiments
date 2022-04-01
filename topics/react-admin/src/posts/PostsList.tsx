import { FC } from 'react';
import {
  Datagrid,
  DeleteButton,
  EditButton,
  List,
  ReferenceArrayField,
  RichTextField,
  ShowButton,
  SingleFieldList,
  TextField,
} from 'react-admin';
import { ChipField } from 'src/components/ChipField';
import { usePermissions } from 'src/lib/react-admin/usePermissions';

export const PostsList: FC = (props) => {
  const { isAdmin, isEditor } = usePermissions();

  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <RichTextField source="body" />
        <ReferenceArrayField reference="authors" source="authorIds">
          <SingleFieldList>
            <ChipField source="login" />
          </SingleFieldList>
        </ReferenceArrayField>
        {isEditor && <EditButton />}
        <ShowButton />
        {isAdmin && <DeleteButton />}
      </Datagrid>
    </List>
  );
};
