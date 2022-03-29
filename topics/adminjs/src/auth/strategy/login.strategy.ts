import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Strategy } from './strategy';
import { Request } from 'express';

@Injectable()
export class LoginStrategy extends Strategy {
  constructor(private usersService: UsersService) {
    super('login');
  }

  private getLogin(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const login = authorization.replace('Login ', '');

    if (!login) {
      throw new UnauthorizedException();
    }

    return { login };
  }

  public async validate(context: ExecutionContext): Promise<User> {
    const { login } = this.getLogin(context);

    return await this.usersService.getByLogin(login);
  }
}
