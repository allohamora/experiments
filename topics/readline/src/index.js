import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { on } from 'node:events';
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  res.end('Hello World');
});

const PORT = 3000;

const listen = () =>
  new Promise((res, rej) => {
    server.listen(PORT, () => {
      console.log(`server started at port ${PORT}`);

      res();
    });

    server.on('error', (error) => {
      rej(error);
    });
  });

const commands = {
  ping: () => 'pong',
};

const main = async () => {
  await listen();

  const rl = readline.createInterface({ input, output });

  rl.write('\nwrite your command: \n');

  let latestResult;

  for await (const line of on(rl, 'line')) {
    const [commandKey] = line;

    if (commandKey === latestResult) {
      continue;
    }

    const command = commands[commandKey] ?? (() => 'command not found');
    const result = command();
    latestResult = result;

    rl.write(`${result}\n`);
  }
};

main();
