import { spawn } from 'child_process';

export const spawnCommand = async (commandName, args) => {
  return await new Promise((res, rej) => {
    const child = spawn(commandName, args, { stdio: 'inherit' });

    child.on('error', (err) => rej(err));
    child.on('exit', () => res());
  })
};

export const runCommand = async (command) => {
  const [name, ...args] = command.split(' ');

  return await spawnCommand(name, args);
}