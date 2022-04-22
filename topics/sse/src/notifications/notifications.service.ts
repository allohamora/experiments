import { Injectable } from '@nestjs/common';
import { fromEvent, map } from 'rxjs';
import { EventEmitter } from 'node:stream';

@Injectable()
export class NotificationsService {
  private ee = new EventEmitter();

  private newNotificationKey(id: string) {
    return `new-notification/${id}`;
  }

  public subscribe(id: string) {
    return fromEvent(this.ee, this.newNotificationKey(id)).pipe(
      map((value) => JSON.stringify(value)),
    );
    // the same
    // return new Observable((subscriber) => {
    //   const handler = (message: unknown) => {
    //     subscriber.next(JSON.stringify(message));
    //   };

    //   this.ee.on(event, handler);

    //   return () => this.ee.off(event, handler);
    // });
  }

  public notify(id: string, message: string) {
    return this.ee.emit(this.newNotificationKey(id), { id, message });
  }
}
