import { AuthGuard } from './auth.guard';

export class LoginGuard extends AuthGuard('login') {}
