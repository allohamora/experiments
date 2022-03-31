import { FC } from 'react';
import {
  ChipField,
  ReferenceArrayField,
  RichTextField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from 'react-admin';

export const PostShow: FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <RichTextField source="body" />
      <ReferenceArrayField reference="authors" source="authorIds">
        <SingleFieldList>
          <ChipField source="login" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
);
