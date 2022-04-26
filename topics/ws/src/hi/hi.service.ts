import { Injectable } from '@nestjs/common';

@Injectable()
export class HiService {
  public hi(userId: string) {
    return `hi ${userId}!`;
  }
}
