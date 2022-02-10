import path from 'path';
import { Worker, WorkerOptions } from 'worker_threads';

const INIT_PATH = path.resolve(__dirname, 'init.js');

export const createWorker = (handler: string, options: WorkerOptions = {}) => {
  return new Worker(INIT_PATH, { ...options, workerData: { ...options.workerData, handler } });
};
