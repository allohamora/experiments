import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const PORT = 3000;

const storage = new AsyncLocalStorage();

let idSeq = 0;

const log = (msg) => {
  const store = storage.getStore();

  console.log({ msg, store });
};

const hardWork = (res) => {
  res.writeHead(200, 'OK');
  res.end('Hello World!');
  log('end');
};

http
  .createServer((req, res) => {
    storage.run({ id: idSeq++ }, () => {
      log('start');

      storage.getStore().secret = 'secret';
      console.log({ msg: 'store inside after mutation', store: storage.getStore() });

      setTimeout(() => {
        hardWork(res);
      }, 5000);
    });
  })
  .listen(PORT, () => console.log(`server is listening port: ${PORT}`));

console.log({ msg: 'store outside', store: storage.getStore() });
