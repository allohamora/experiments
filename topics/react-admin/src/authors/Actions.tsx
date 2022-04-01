import { FC } from 'react';
import { CreateButton, TopToolbar } from 'react-admin';

export const Actions: FC = (props) => (
  <TopToolbar {...props}>
    <CreateButton />
  </TopToolbar>
);
