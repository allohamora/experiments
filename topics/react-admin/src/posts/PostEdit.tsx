import { FC } from 'react';
import { Edit, ReferenceArrayInput, required, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';
import { RichTextInput } from 'src/components/RichTextInput';

export const PostEdit: FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" validate={required()} disabled fullWidth />
      <TextInput source="title" validate={required()} />
      <RichTextInput source="body" validate={required()} />
      <ReferenceArrayInput source="authorIds" reference="authors" validate={required()} fullWidth>
        <SelectArrayInput optionText="login" fullWidth />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
