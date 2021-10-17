import { Worker } from 'worker_threads';
import { Executor } from './executor';
import { createWorker } from '../worker/create-worker';

interface Options {
  handler: string;
}

export class WorkerExecutor<A extends unknown, R extends unknown> implements Executor<A, R> {
  private worker: Worker;

  constructor({ handler }: Options) {
    this.worker = createWorker(handler);
  }

  public async exec(...args: A[]): Promise<R> {
    return await new Promise((res, rej) => {
      const onMessage = (result: R) => {
        res(result);

        clean.call(this);
      };

      const onError = (err: Error) => {
        rej(err);

        clean.call(this);
      };

      this.worker.once('message', onMessage);
      this.worker.once('error', onError);

      function clean(this: WorkerExecutor<A, R>) {
        this.worker.off('message', onMessage);
        this.worker.off('error', onError);
      }

      this.worker.postMessage(args);
    });
  }

  public async destroy() {
    await this.worker.terminate();
  }
}
