import { FC } from 'react';
import { Edit, ReferenceArrayInput, required, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';
import { usePermissionRedirect } from 'src/lib/react-admin/usePermissionRedirect';

export const AuthorEdit: FC = (props) => {
  usePermissionRedirect(['admin']);

  return (
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
};
