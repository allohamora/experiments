import { ResourceProps } from 'react-admin';
import { AuthorCreate } from './AuthorCreate';
import { AuthorEdit } from './AuthorEdit';
import { AuthorShow } from './AuthorShow';
import { AuthorLists } from './AuthorsList';
import { AccountCircle } from '@material-ui/icons';

export default {
  name: 'authors',
  create: AuthorCreate,
  list: AuthorLists,
  edit: AuthorEdit,
  show: AuthorShow,
  icon: AccountCircle,
} as ResourceProps;
