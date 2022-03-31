import { FC } from 'react';
import { ChipField, ReferenceArrayField, Show, SimpleShowLayout, SingleFieldList, TextField } from 'react-admin';

export const AuthorShow: FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="login" />
      <ReferenceArrayField reference="posts" source="postsIds">
        <SingleFieldList>
          <ChipField source="title" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
