import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { user } = req;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
