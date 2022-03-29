import { User } from 'src/users/user.entity';

declare module 'adminjs' {
  interface Admin extends User {
    email: string;
  }

  export type CurrentAdmin = Admin | false | null;
}
