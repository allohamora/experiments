import { AuthGuard } from './auth.guard';

export class IdGuard extends AuthGuard('id') {}
