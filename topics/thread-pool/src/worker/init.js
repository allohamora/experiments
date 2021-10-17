const path = require('path');
const { workerData } = require('worker_threads');

if (!workerData.handler) {
  throw new Error('provide workerData.path');
}

const handlerPath = path.resolve(__dirname, 'handlers', workerData.handler);

require('ts-node').register({ transpileOnly: true });
require(handlerPath);
