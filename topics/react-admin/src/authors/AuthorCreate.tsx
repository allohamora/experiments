import { FC } from 'react';
import { Create, ReferenceArrayInput, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';
import { usePermissionRedirect } from 'src/lib/react-admin/usePermissionRedirect';

export const AuthorCreate: FC = (props) => {
  usePermissionRedirect(['admin']);

  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="login" fullWidth />
        <ReferenceArrayInput source="postsIds" reference="posts" fullWidth>
          <SelectArrayInput optionText="title" fullWidth />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};
