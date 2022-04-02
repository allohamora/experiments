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
import { ButtonsGroup } from 'src/components/ButtonsGroup';

export const PostList: FC = (props) => (
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
      <ButtonsGroup>
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </ButtonsGroup>
    </Datagrid>
  </List>
);
