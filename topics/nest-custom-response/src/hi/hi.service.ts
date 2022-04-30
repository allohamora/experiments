import { Injectable } from '@nestjs/common';

@Injectable()
export class HiService {
  public hi() {
    return { message: 'hi' };
  }
}
