import { Pool, WorkerExecutor } from './pool';

const FIB_ARG = 1;
const FIB_EXECUTORS_NUMBER = 10;

const pool = new Pool<number, number>({
  executorFactory: () => new WorkerExecutor({ handler: 'fib' }),
  size: FIB_EXECUTORS_NUMBER,
});

const main = async () => {
  const result = await Promise.all(
    Array.from({ length: FIB_EXECUTORS_NUMBER + 20 }, async () => await pool.exec(FIB_ARG)),
  );

  console.log(result);
  await pool.destroy();
};

main();
