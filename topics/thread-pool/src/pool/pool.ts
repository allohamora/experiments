import { Executor } from '.';
import { Debonce } from '../decorators/debonce';

interface Options<A, R> {
  size: number;
  executorFactory: () => Executor<A, R>;
}

interface Queue<A, R> {
  resolve: (result: R) => void;
  reject: (err: Error) => void;
  args: A[];
}

export class Pool<A extends unknown, R extends unknown> implements Executor<A, R> {
  private executors: Executor<A, R>[];

  private queue: Queue<A, R>[] = [];
  private isQueueHandlerRunning = false;

  constructor({ size, executorFactory }: Options<A, R>) {
    this.executors = Array.from({ length: size }, executorFactory);
  }

  @Debonce(100, true)
  private async queueHandler() {
    if (this.isQueueHandlerRunning) return;

    this.isQueueHandlerRunning = true;

    const executorsLength = this.executors.length;
    const queueLength = this.queue.length;
    const executorsNumber = queueLength > executorsLength ? executorsLength : queueLength;

    const executors = this.executors.slice(0, executorsNumber);
    const tasks = this.queue.splice(0, executorsNumber);

    await Promise.all(
      executors.map(async (executor, i) => {
        const { args, resolve, reject } = tasks[i];

        await executor
          .exec(...args)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => reject(err));
      }),
    );

    this.isQueueHandlerRunning = false;

    if (this.queue.length !== 0) {
      this.queueHandler();
    }
  }

  public async exec(...args: A[]): Promise<R> {
    return await new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, args });
      this.queueHandler();
    });
  }

  public async destroy() {
    await Promise.all(this.executors.map(async (executor) => await executor.destroy()));
  }
}
