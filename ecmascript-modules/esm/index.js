import { sum } from './sum';
import { strict as assert } from 'assert';
import { performance } from 'perf_hooks';
import { promises as fps } from 'fs';
import path from 'path';

const start = performance.now();
const result = sum(1, 2);
const expected = 3;

const RESULT_PATH = path.join(__dirname, 'result.json');

const exists = async (path) => {
  try {
    await fps.access(path);
    return true;
  } catch (error) {
    return false;
  }
}

const writeToResult = async (data) => {
  const isFileExists = await exists(RESULT_PATH);
  const state = isFileExists ? JSON.parse(await fps.readFile(RESULT_PATH)) : [];

  state.push(data);

  const finalData = JSON.stringify(state, null, 2);

  await fps.writeFile(RESULT_PATH, finalData);
}

const getMemoryUsedMb = () => {
  const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  const memoryUsedMb = Math.round(memoryUsed * 100) / 100;

  return memoryUsedMb;
}

const test = () => {
  assert.deepEqual(result, expected);

  const end = performance.now();
  const time = end - start;
  const memory = getMemoryUsedMb();

  return { time, memory }
}

writeToResult(test());