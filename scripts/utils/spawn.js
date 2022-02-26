import { spawn } from 'node:child_process';

export const spawnCommand = (name, ...args) => {
  return new Promise((res, rej) => {
    const child = spawn(name, args);

    child.on('error', rej);
    child.on('exit', res);
  });
};
