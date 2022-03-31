import { FC } from 'react';
import { Edit, ReferenceArrayInput, required, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';

export const AuthorEdit: FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" disabled fullWidth />
      <TextInput source="login" validate={required()} fullWidth />
      <ReferenceArrayInput source="postsIds" reference="posts" validate={required()} fullWidth>
        <SelectArrayInput optionText="title" fullWidth />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
