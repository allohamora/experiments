import { FC } from 'react';
import {
  ChipField,
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

export const PostsList: FC = (props) => (
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
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
