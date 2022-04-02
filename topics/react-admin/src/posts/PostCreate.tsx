import { FC } from 'react';
import { Create, ReferenceArrayInput, required, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';
import { RichTextInput } from 'src/components/RichTextInput';

export const PostCreate: FC = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" fullWidth validate={required()} />
      <RichTextInput source="body" validate={required()} />
      <ReferenceArrayInput source="authorIds" reference="authors" validate={required()} fullWidth>
        <SelectArrayInput optionText="login" fullWidth />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);
