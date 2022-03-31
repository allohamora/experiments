import RichTextInput from 'ra-input-rich-text';
import { FC } from 'react';
import { Create, ReferenceArrayInput, required, SelectArrayInput, SimpleForm, TextInput } from 'react-admin';
import { Quill } from 'quill';

export const QUILL_ROWS = 4;
export const configureQuill = (quill: Quill) => (quill.root.style.height = `${38 * QUILL_ROWS}px`);

export const PostCreate: FC = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" fullWidth validate={required()} />
      <RichTextInput source="body" validate={required()} configureQuill={configureQuill} />
      <ReferenceArrayInput source="authorIds" reference="authors" validate={required()} fullWidth>
        <SelectArrayInput optionText="login" fullWidth />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);
