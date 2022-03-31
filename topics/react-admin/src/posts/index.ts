import { ResourceProps } from 'react-admin';
import { PostCreate } from './PostCreate';
import { PostEdit } from './PostEdit';
import { PostShow } from './PostShow';
import { PostsList } from './PostsList';
import { NoteAdd } from '@material-ui/icons';

export default {
  name: 'posts',
  list: PostsList,
  create: PostCreate,
  edit: PostEdit,
  show: PostShow,
  icon: NoteAdd,
} as ResourceProps;
