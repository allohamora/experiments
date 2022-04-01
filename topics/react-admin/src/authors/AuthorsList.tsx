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
import { Actions } from 'src/authors/Actions';

export const AuthorLists: FC = (props) => (
  <List {...props} actions={<Actions />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="login" />
      <ReferenceArrayField reference="posts" source="postsIds">
        <SingleFieldList>
          <ChipField source="title" />
        </SingleFieldList>
      </ReferenceArrayField>
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
