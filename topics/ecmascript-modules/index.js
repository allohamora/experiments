const path = require('path');
const { spawn } = require('child_process');
const { promises: fsp } = require('fs');

const COUNT = 20;
const RESULTS_PATH = path.join(__dirname, 'results.json');

const exists = async (path) => {
  try {
    await fsp.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const runCommand = (...spawnArgs) =>
  new Promise((res) => {
    const command = spawn(...spawnArgs);

    command.on('exit', res);
  });

/**
 *
 * @param {"esm" | "mjs"} type
 */
const collectResults = async (type) => {
  const resultPath = path.join(__dirname, './', type, 'result.json');

  if (await exists(resultPath)) {
    await fsp.rm(resultPath);
  }

  const spawnArgs = ['npm', ['run', `start:${type}`], { cwd: process.cwd(), shell: true }];

  // don't use Promise.all because race condition
  await Array.from({ length: COUNT }).reduce((chain) => chain.then(() => runCommand(...spawnArgs)), Promise.resolve());

  return require(resultPath);
};

/**
 *
 * @param {{ actual: number, expected: number, time: number, memory: number }[]} resultState
 * @param {string} name
 */
const getResult = (resultState, name) => {
  const total = resultState.reduce(
    (result, cur) => {
      result.memory += cur.memory;
      result.time += cur.time;

      return result;
    },
    { memory: 0, time: 0 },
  );

  const getAverage = (totalValue) => totalValue / resultState.length;

  const average = { memory: getAverage(total.memory), time: getAverage(total.time) };
  const result = { average, name, count: resultState.length };

  return result;
};

const getResults = async () => {
  const names = ['esm', 'mjs'];

  const results = await Promise.all(
    names.map((name) => collectResults(name).then((result) => getResult(result, name))),
  );

  return results;
};

const showResults = (results) => {
  console.log(results);

  return results;
};

const saveResults = async (results) => {
  const finalResults = JSON.stringify(results, null, 2);

  await fsp.writeFile(RESULTS_PATH, finalResults);

  return results;
};

getResults().then(showResults).then(saveResults);
