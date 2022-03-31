import { FC } from 'react';
import { Create, ReferenceArrayInput, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';

export const AuthorCreate: FC = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="login" fullWidth />
      <ReferenceArrayInput source="postsIds" reference="posts" fullWidth>
        <SelectArrayInput optionText="title" fullWidth />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);
