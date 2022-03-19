import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  public async getUserById(id: number) {
    return await this.userService.getUserById({ id });
  }
}
