import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthService } from '../auth.service';
import { Strategy } from './strategy';
import { FastifyRequest } from 'fastify';

@Injectable()
export class IdStrategy extends Strategy {
  constructor(private authService: AuthService) {
    super('id');
  }

  private getUserId(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const idString = authorization.replace('Id ', '');

    if (!idString) {
      throw new UnauthorizedException();
    }

    const id = Number(idString);

    if (isNaN(id)) {
      throw new UnauthorizedException();
    }

    return { id };
  }

  public async validate(context: ExecutionContext): Promise<User> {
    const { id } = this.getUserId(context);

    return await this.authService.getUserById(id);
  }
}
