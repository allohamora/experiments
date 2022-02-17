import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public publicData() {
    return 'public-data';
  }

  public privateData() {
    return 'private-data';
  }
}
